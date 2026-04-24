#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol};

const YES: Symbol = symbol_short!("YES");
const NO: Symbol = symbol_short!("NO");
const MAYBE: Symbol = symbol_short!("MAYBE");

#[contract]
pub struct PollContract;

#[contractimpl]
impl PollContract {
    pub fn vote(env: Env, option: Symbol) {
        let count: u32 = env.storage().persistent().get(&option).unwrap_or(0);
        env.storage().persistent().set(&option, &(count + 1));
    }

    pub fn get_votes(env: Env, option: Symbol) -> u32 {
        env.storage().persistent().get(&option).unwrap_or(0)
    }
}