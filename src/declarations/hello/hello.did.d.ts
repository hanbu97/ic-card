import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Shop { 'name' : string }
export interface _SERVICE {
  'all_shops' : ActorMethod<[], Array<string>>,
  'create_shop' : ActorMethod<[string], undefined>,
  'get_shops' : ActorMethod<[], Array<Shop>>,
  'greet' : ActorMethod<[string], string>,
  'whoami' : ActorMethod<[], string>,
}
