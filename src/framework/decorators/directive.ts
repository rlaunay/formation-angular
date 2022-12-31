import { DirectiveMetadata } from '../types'

export function Directive(metadata: DirectiveMetadata) {
  return function (decoratedClass: any) {
    decoratedClass["selector"] = metadata.selector;
    decoratedClass["providers"] = metadata.providers || [];
    return decoratedClass;
  }
}