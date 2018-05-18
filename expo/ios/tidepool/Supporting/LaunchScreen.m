#import "LaunchScreen.h"

static RCTRootView *gReactRootView = nil;
static UIActivityIndicatorView *gActivityIndicatorView = nil;
static BOOL gVisible = false;

@implementation LaunchScreen

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue{
  return dispatch_get_main_queue();
}

+ (void)showLaunchView:(UIView *)launchView
 activityIndicatorView:(UIActivityIndicatorView *)activityIndicatorView
         reactRootView:(RCTRootView *)reactRootView {
  if (gVisible) {
    return;
  }
  
  gVisible = true;

  gActivityIndicatorView = activityIndicatorView;
  
  gReactRootView = reactRootView;
  gReactRootView.loadingViewFadeDelay = 0;
  gReactRootView.loadingViewFadeDuration = 0.35;
  
  [[NSNotificationCenter defaultCenter] removeObserver:gReactRootView  name:RCTContentDidAppearNotification object:gReactRootView];
  
  [gReactRootView setLoadingView:launchView];
}

RCT_EXPORT_METHOD(showActivityIndicator) {
  if (!gReactRootView || !gVisible) {
    return;
  }
  
  gActivityIndicatorView.alpha = 1.0;
  [gActivityIndicatorView startAnimating];
}

RCT_EXPORT_METHOD(hide) {
  if (!gReactRootView || !gVisible) {
    return;
  }
  
  gVisible = false;
  
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(gReactRootView.loadingViewFadeDelay * NSEC_PER_SEC)),
                 dispatch_get_main_queue(),
                 ^{
                   [UIView transitionWithView:gReactRootView
                                     duration:gReactRootView.loadingViewFadeDuration
                                      options:UIViewAnimationOptionTransitionCrossDissolve
                                   animations:^{
                                     gReactRootView.loadingView.alpha = 0.0;
                                   } completion:^(__unused BOOL finished) {
                                     [gReactRootView.loadingView removeFromSuperview];
                                   }];
                 });
}

@end
