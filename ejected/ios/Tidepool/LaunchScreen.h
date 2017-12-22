#import <React/RCTBridgeModule.h>
#import <React/RCTRootView.h>

@interface LaunchScreen : NSObject <RCTBridgeModule>

+ (void)showLaunchView:(UIView *)launchView
 activityIndicatorView:(UIActivityIndicatorView *)activityIndicatorView
         reactRootView:(RCTRootView *)reactRootView;

@end
