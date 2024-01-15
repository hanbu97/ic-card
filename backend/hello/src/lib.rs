use std::cell::RefCell;
use std::collections::HashMap;

use candid::{CandidType, Principal};

thread_local! {
    static SHOPS: RefCell<Vec<Shop>> = RefCell::new(Vec::new());
    static CUSTOMER_SHOPS: RefCell<HashMap<Principal, Vec<usize>>> = RefCell::new(HashMap::new());
}

#[derive(CandidType, Clone, PartialEq, Eq, Hash)]
struct Shop {
    idx: usize,
    name: String,
    owner: Principal,
    closed: bool,
    customer: Vec<Principal>,
}

#[derive(CandidType, Clone, PartialEq, Eq, Hash)]
struct ShopOut {
    idx: u64,
    name: String,
    owner: String,
    customer: Vec<String>,
}

impl From<Shop> for ShopOut {
    fn from(s: Shop) -> Self {
        ShopOut {
            idx: s.idx as u64,
            name: s.name,
            owner: s.owner.to_string(),
            customer: s.customer.iter().map(|p| p.to_string()).collect(),
        }
    }
}

#[ic_cdk::update]
fn add_card(name: String) {
    let caller = ic_cdk::caller();
    SHOPS.with(|shops| {
        let mut shops = shops.borrow_mut();
        let s = shops.iter_mut().find(|s| s.name == name).unwrap();
        s.customer.push(caller);

        CUSTOMER_SHOPS.with(|customer_shops| {
            let mut customer_shops = customer_shops.borrow_mut();
            let shops = customer_shops.entry(caller).or_insert_with(Vec::new);
            shops.push(s.idx);
        });
    });
}

#[ic_cdk::query]
fn get_cards() -> Vec<String> {
    let caller = ic_cdk::caller();
    CUSTOMER_SHOPS.with(|shops| {
        shops
            .borrow()
            .get(&caller)
            .cloned()
            .unwrap_or_else(Vec::new)
            .iter()
            .map(|i| {
                SHOPS.with(|shops| {
                    let shops = shops.borrow();
                    format!("{}:{}", shops[*i].name, shops[*i].owner.to_string())
                })
            })
            .collect()
    })
}

#[ic_cdk::query]
fn get_shops() -> Vec<ShopOut> {
    let caller = ic_cdk::caller();
    SHOPS.with(|shops| {
        let shops = shops.borrow();
        shops
            .iter()
            .filter(|s| !s.closed)
            .filter(|s| s.owner == caller)
            .cloned()
            .map(|s| s.into())
            .collect()
    })
}

#[ic_cdk::query]
fn all_shops() -> Vec<String> {
    SHOPS.with(|shops| {
        let shops = shops.borrow();
        shops
            .iter()
            .filter(|s| !s.closed)
            .map(|s| format!("{}:{}", s.name, s.owner.to_string()))
            .collect()
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
        let idx = shops.len();
        shops.push(Shop {
            idx,
            name,
            owner: caller,
            closed: false,
            customer: Vec::new(),
        });
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
