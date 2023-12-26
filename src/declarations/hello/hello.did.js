export const idlFactory = ({ IDL }) => {
  const Shop = IDL.Record({ 'name' : IDL.Text });
  return IDL.Service({
    'all_shops' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'create_shop' : IDL.Func([IDL.Text], [], []),
    'get_shops' : IDL.Func([], [IDL.Vec(Shop)], ['query']),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'whoami' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
