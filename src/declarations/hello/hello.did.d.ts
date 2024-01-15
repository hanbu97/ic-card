import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Shop {
  'idx' : bigint,
  'customer' : Array<string>,
  'owner' : string,
  'name' : string,
}
export interface _SERVICE {
  'add_card' : ActorMethod<[string], undefined>,
  'all_shops' : ActorMethod<[], Array<string>>,
  'create_shop' : ActorMethod<[string], undefined>,
  'get_cards' : ActorMethod<[], Array<string>>,
  'get_shops' : ActorMethod<[], Array<Shop>>,
  'greet' : ActorMethod<[string], string>,
  'whoami' : ActorMethod<[], string>,
}
