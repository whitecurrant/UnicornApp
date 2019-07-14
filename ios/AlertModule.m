//
//  AlertModule.m
//  UnicornApp
//
//  Created by Marcin Adamczyk on 14/07/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AlertModule.h"
#import <UIKit/UIKit.h>


@implementation AlertModule

RCT_EXPORT_MODULE(NativeAlert);

RCT_EXPORT_METHOD(show:(NSString *)message)
{
  UIAlertController *alert = [UIAlertController
                               alertControllerWithTitle:nil
                               message:message
                               preferredStyle:UIAlertViewStyleDefault];
  [alert addAction:[UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleCancel handler: nil]];

  UIViewController *viewController = [[[[UIApplication sharedApplication] delegate] window] rootViewController];

  [viewController presentViewController:alert animated:YES completion:nil];

}

@end
