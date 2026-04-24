#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, Symbol, Map};

#[contracttype]
pub enum DataKey {
    Option(Symbol),
    TotalVotes,
}

#[contract]
pub struct PollContract;

#[contractimpl]
impl PollContract {
    pub fn vote(env: Env, option: Symbol) -> u32 {
        let key = DataKey::Option(option.clone());
        let count: u32 = env.storage().persistent().get(&key).unwrap_or(0);
        let new_count = count + 1;
        env.storage().persistent().set(&key, &new_count);

        let total: u32 = env.storage().persistent().get(&DataKey::TotalVotes).unwrap_or(0);
        env.storage().persistent().set(&DataKey::TotalVotes, &(total + 1));

        new_count
    }

    pub fn get_votes(env: Env, option: Symbol) -> u32 {
        let key = DataKey::Option(option);
        env.storage().persistent().get(&key).unwrap_or(0)
    }

    pub fn get_total(env: Env) -> u32 {
        env.storage().persistent().get(&DataKey::TotalVotes).unwrap_or(0)
    }
}