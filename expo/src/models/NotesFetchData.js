import HashtagCollection from "../models/HashtagCollection";

class NotesFetchData {
  userId = "";
  errorMessage = "";
  fetching = false;
  fetched = false;
  hashtagCollection = new HashtagCollection();
  hashtags = this.hashtagCollection.hashtagsSortedByCount;
  searchText = "";
  unfilteredNotes = [];
  notes = [];

  didStart({ userId }) {
    this.userId = userId;
    this.errorMessage = "";
    this.fetching = true;
    this.fetched = false;
    this.hashtagCollection = new HashtagCollection();
    this.hashtags = this.hashtagCollection.hashtagsSortedByCount;
    this.unfilteredNotes = [];
    this.notes = [];
  }

  didSucceed({ notes, profile }) {
    if (profile.userId === this.userId) {
      this.userId = profile.userId;
      this.errorMessage = "";
      this.fetching = false;
      this.fetched = true;
      this.hashtagCollection.reloadHashtagsForObjectsWithText({
        objectsWithText: notes,
        textPropertyName: "messageText",
      });
      this.hashtags = this.hashtagCollection.hashtagsSortedByCount;
      this.unfilteredNotes = notes;
      this.filterNotes();
    } else {
      // console.log(
      //   `didSucceed called for unexpected user, or when user was signed out, ignoring, userId: ${this.userId}`
      // );
    }
  }

  didFail({ errorMessage, profile }) {
    if (profile.userId === this.userId) {
      this.errorMessage = errorMessage;
      this.fetching = false;
      this.fetched = false;
      this.unfilteredNotes = [];
      this.notes = [];
    } else {
      // console.log(
      //   `didFail called for unexpected user, or when user was signed out, ignoring, userId: ${this.userId}`
      // );
    }
  }

  addNote({ profile, note }) {
    if (profile.userId === this.userId) {
      this.hashtagCollection.updateHashtagsForText({
        objectWithTextToAdd: note,
        textPropertyName: "messageText",
      });
      this.hashtags = this.hashtagCollection.hashtagsSortedByCount;
      const sortedNotes = [note, ...this.notes];
      sortedNotes.sort((note1, note2) => note2.timestamp - note1.timestamp);
      this.unfilteredNotes = sortedNotes;
      this.filterNotes();
    } else {
      // console.log(
      //   `Unexpected insert of note with profile userId: ${
      //     profile.userId
      //   } in notes list for profile userId: ${this.userId}`
      // );
    }
  }

  updateNote({ profile, note, originalNote }) {
    if (profile.userId === this.userId) {
      const noteIndex = this.notes.findIndex(
        subjectNote => subjectNote.id === note.id
      );
      if (noteIndex !== -1) {
        this.hashtagCollection.updateHashtagsForText({
          objectWithTextToRemove: originalNote,
          objectWithTextToAdd: note,
          textPropertyName: "messageText",
        });
        this.hashtags = this.hashtagCollection.hashtagsSortedByCount;
        const sortedNotes = [
          ...this.notes.slice(0, noteIndex),
          note,
          ...this.notes.slice(noteIndex + 1),
        ];
        sortedNotes.sort((note1, note2) => note2.timestamp - note1.timestamp);
        this.unfilteredNotes = sortedNotes;
        this.filterNotes();
      } else {
        // console.log(
        //   `Could not find the edited note in current notes, this is unexpected`
        // );
      }
    } else {
      // console.log(
      //   `Unexpected update of note with profile userId: ${
      //     profile.userId
      //   } in notes list for profile userId: ${this.userId}`
      // );
    }
  }

  deleteNote({ profile, note }) {
    if (profile.userId === this.userId) {
      const noteIndex = this.notes.findIndex(
        subjectNote => subjectNote.id === note.id
      );
      if (noteIndex !== -1) {
        this.hashtagCollection.updateHashtagsForText({
          objectWithTextToRemove: note,
          textPropertyName: "messageText",
        });
        this.hashtags = this.hashtagCollection.hashtagsSortedByCount;
        const sortedNotes = [
          ...this.notes.slice(0, noteIndex),
          ...this.notes.slice(noteIndex + 1),
        ];
        this.unfilteredNotes = sortedNotes;
        this.filterNotes();
      } else {
        // console.log(
        //   `Could not find the deleted note in current notes, this is unexpected`
        // );
      }
    } else {
      // console.log(
      //   `Unexpected delete of note with profile userId: ${
      //     profile.userId
      //   } in notes list for profile userId: ${this.userId}`
      // );
    }
  }

  setSearchFilter({ searchText }) {
    this.searchText = searchText;
    this.filterNotes();
  }

  filterNotes() {
    let filteredNotes = this.unfilteredNotes;
    if (this.searchText.length) {
      const searchTextLowerCase = this.searchText.toLowerCase();
      filteredNotes = this.unfilteredNotes.filter(note => {
        if (note.messageText.toLowerCase().includes(searchTextLowerCase)) {
          return true;
        } else if (
          note.userFullName.toLowerCase().includes(searchTextLowerCase)
        ) {
          return true;
        }
        return false;
      });
    }

    this.notes = filteredNotes;
  }
}

export default NotesFetchData;
