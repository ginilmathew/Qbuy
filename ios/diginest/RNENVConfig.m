#import "RNENVConfig.h"
@implementation RNENVConfig
RCT_EXPORT_MODULE();
- (NSDictionary *)constantsToExport
{
  #if DEBUGGREEN
  NSString *env=@"testing";
  NSString *mode=@"green";
  #elif DEBUGFASHION
  NSString *env=@"testing";
  NSString *mode=@"fashion";
  #elif DEBUGPANDA
  NSString *env=@"testing";
  NSString *mode=@"panda";
  #elif RELEASEGREEN
  NSString *env=@"live";
  NSString *mode=@"green";
  #elif RELEASEFASHION
  NSString *env=@"live";
  NSString *mode=@"fashion";
  #else
  NSString *env=@"live";
  NSString *mode=@"panda";
  #endif
  return @{ @"env": env, @"mode" : mode };
}
+ (BOOL)requiresMainQueueSetup{
  return YES;
}
@end
