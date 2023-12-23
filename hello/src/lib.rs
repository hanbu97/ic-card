#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, rust test hahaha  {}!", name)
}

#[ic_cdk::query]
fn whoami() -> String {
    let caller_principal = ic_cdk::caller();
    format!("{}", caller_principal)
}

thread_local! {}

// Always include this at the end of your file
ic_cdk::export_candid!();
