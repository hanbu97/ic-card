use std::cell::RefCell;
use std::collections::HashMap;

use candid::{CandidType, Principal};

thread_local! {
    static SHOPS: RefCell<HashMap<Principal, Vec<Shop>>> = RefCell::new(HashMap::new());
}

#[derive(CandidType, Clone)]
struct Shop {
    name: String,
}

#[ic_cdk::query]
fn get_shops() -> Vec<Shop> {
    let caller = ic_cdk::caller();
    SHOPS.with(|shops| {
        shops
            .borrow()
            .get(&caller)
            .cloned()
            .unwrap_or_else(Vec::new)
    })
}

#[ic_cdk::update]
fn create_shop(name: String) {
    let caller = ic_cdk::caller();
    // if caller == Principal::anonymous() {
    //     ic_cdk::trap("Anonymous callers are not allowed to create shops");
    // }

    SHOPS.with(|shops| {
        let mut shops = shops.borrow_mut();
        let shop_list = shops.entry(caller).or_insert_with(Vec::new);
        shop_list.push(Shop { name });
    });
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, rust test hahaha  {}!", name)
}

#[ic_cdk::query]
fn whoami() -> String {
    let caller_principal: Principal = ic_cdk::caller();
    format!("{}", caller_principal)
}

thread_local! {}

// Always include this at the end of your file
ic_cdk::export_candid!();
