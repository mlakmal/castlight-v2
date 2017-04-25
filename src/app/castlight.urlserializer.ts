import { Injectable } from '@angular/core';
import { UrlTree, UrlSerializer, DefaultUrlSerializer } from '@angular/router';

/*
  DefaultUrlSerializer serializes the URL after the AngularJS 1.5 widget
  serializes it. This confuses the embedded widget.

  Eg:
    localhost/castlight##find-care?tab=providers
        gets converted to
    localhost/castlight##find-care%3Ftab=providers
      by AngularJS 1.5. This is then converted to
    localhost/castlight##find-care%243Ftab=providers
      by Angular

  The fix is to convert '%3F' back to '?' before passing it across to Angular.
  And change '?' to '%3F' while serializing the UrlTree.
  */
@Injectable()
export class CastlightUrlSerializer implements UrlSerializer {
  private defaultUrlSerializer: DefaultUrlSerializer;

  constructor() {
    this.defaultUrlSerializer = new DefaultUrlSerializer();
  }

  parse(url: string): UrlTree {
    // Put the '?' back
    let processedUrl: string = url.replace(/%3F/i, '?');
    return this.defaultUrlSerializer.parse(processedUrl);
  }

  serialize(tree: UrlTree): string {
    // Encode '?'
    return this.defaultUrlSerializer.serialize(tree).replace(/\?/, '%3F');
  }
}
