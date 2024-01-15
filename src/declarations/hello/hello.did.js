export const idlFactory = ({ IDL }) => {
  const Shop = IDL.Record({
    'idx' : IDL.Nat64,
    'customer' : IDL.Vec(IDL.Text),
    'owner' : IDL.Text,
    'name' : IDL.Text,
  });
  return IDL.Service({
    'add_card' : IDL.Func([IDL.Text], [], []),
    'all_shops' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'create_shop' : IDL.Func([IDL.Text], [], []),
    'get_cards' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'get_shops' : IDL.Func([], [IDL.Vec(Shop)], ['query']),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'whoami' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
