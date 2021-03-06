import HashtagCollection from "./HashtagCollection";
import Logger from "./Logger";

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
  toggleExpandedNotesCount = 0; // HACK: This is a hack to force toggling of expanded note state to workaround some GL renderer issues when updating notes in list with expanded graphs. See: https://trello.com/c/c32gFG1U

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
      Logger.logWarning(
        `didSucceed called for unexpected user, or when user was signed out, ignoring, userId: ${
          this.userId
        }`
      );
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
      Logger.logWarning(
        `didFail called for unexpected user, or when user was signed out, ignoring, userId: ${
          this.userId
        }`
      );
    }
  }

  addNote({ profile, note }) {
    const noteToAdd = note;
    if (profile.userId === this.userId) {
      noteToAdd.userAddedAt = new Date();
      noteToAdd.initiallyExpanded = true;
      this.hashtagCollection.updateHashtagsForText({
        objectWithTextToAdd: noteToAdd,
        textPropertyName: "messageText",
      });
      this.hashtags = this.hashtagCollection.hashtagsSortedByCount;
      const sortedNotes = [noteToAdd, ...this.notes];
      sortedNotes.sort((note1, note2) => note2.timestamp - note1.timestamp);
      this.unfilteredNotes = sortedNotes;
      this.filterNotes();
    } else {
      Logger.logWarning(
        `Unexpected insert of note with profile userId: ${
          profile.userId
        } in notes list for profile userId: ${this.userId}`
      );
    }
  }

  updateNote({ profile, note, originalNote }) {
    if (profile.userId === this.userId) {
      const noteToUpdate = note;
      noteToUpdate.userUpdatedAt = new Date();
      const noteIndex = this.notes.findIndex(
        subjectNote => subjectNote.id === noteToUpdate.id
      );
      if (noteIndex !== -1) {
        this.hashtagCollection.updateHashtagsForText({
          objectWithTextToRemove: originalNote,
          objectWithTextToAdd: noteToUpdate,
          textPropertyName: "messageText",
        });
        this.hashtags = this.hashtagCollection.hashtagsSortedByCount;
        const sortedNotes = [
          ...this.notes.slice(0, noteIndex),
          noteToUpdate,
          ...this.notes.slice(noteIndex + 1),
        ];
        sortedNotes.sort((note1, note2) => note2.timestamp - note1.timestamp);
        this.unfilteredNotes = sortedNotes;
        this.filterNotes();
      } else {
        Logger.logWarning(
          `Could not find the note to update in current notes, this is unexpected`
        );
      }
    } else {
      Logger.logWarning(
        `Unexpected update of note with profile userId: ${
          profile.userId
        } in notes list for profile userId: ${this.userId}`
      );
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
        Logger.logWarning(
          `Could not find the deleted note in current notes, this is unexpected`
        );
      }
    } else {
      Logger.logWarning(
        `Unexpected delete of note with profile userId: ${
          profile.userId
        } in notes list for profile userId: ${this.userId}`
      );
    }
  }

  advanceToggleExpandedNotesCount() {
    this.toggleExpandedNotesCount += 1;
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
        }
        if (note.userFullName.toLowerCase().includes(searchTextLowerCase)) {
          return true;
        }
        return false;
      });
    }

    this.notes = filteredNotes;
  }
}

export default NotesFetchData;
