const { Flow } = require('./flow');
const t = require('@onflow/types');
const DappTransactions = require('./dapp-transactions');
const DappScripts = require('./dapp-scripts');
const CONTRACT = 'access(all) contract Noop {}';


module.exports = class Blockchain {

    /**
     * @dev Calls a read-only smart contract function
     */
    static async get(env, tx, args) {
        //console.log("Get Debugging")
        let options = {
        }
        if (args) {
            //console.log("Arguments Present")
            options.args = [];
            for(let arg in args) {
                //console.log("Arg: " + arg)
                //console.log(typeof args[arg])
                if (typeof args[arg] === 'String') {
                    options.args.push({
                        value: args[arg],
                        type: t.String
                    });
                }
                else if (typeof args[arg] === 'string'){ // Temporary Solution
                    console.log("Pushed Address");
                    options.args.push({
                        value: args[arg],
                        type: t.Address
                    });
                }
                else if (typeof args[arg] === 'number'){ // Temporary Solution
                    console.log("Pushed num");
                    options.args.push({
                        value: args[arg],
                        type: t.UInt64
                    });
                }
                else {
                    options.args.push(args[arg]);
                }
            }
        }
        let flow = new Flow(env.config);
        let response = await flow.executeTransaction(DappScripts[tx](env.imports), options);
        let resultData = await Flow.decode(response);
        console.log("response: " + response)
        console.log("resultData: " + resultData)
        return {
            callAccount: null,
            callData: resultData
        }
    }

    /**
     * @dev Calls a writeable smart contract function
     */
    static async post(env, tx, args) {
        console.log("Testing Post")
        let proposer = typeof env.roles.proposer === 'string' ? env.roles.proposer : env.config.accounts[0];
        console.log("Proposer: " + proposer)
        let roleInfo = {
            [Flow.Roles.PROPOSER]: proposer,
            [Flow.Roles.AUTHORIZERS]: env.roles.authorizers && Array.isArray(env.roles.authorizers) && env.roles.authorizers.length > 0 ? env.roles.authorizers : [ proposer ],
            [Flow.Roles.PAYER]: typeof env.roles.payer === 'string' ? env.roles.payer : proposer
        };
        let options = {
            roleInfo,
            gasLimit: 50
        }

        if (args) {
            console.log("Arguments Present")
            options.args = [];
            for(let arg in args) {
                console.log("Arg: " + arg)
                console.log(typeof args[arg])
                if (typeof args[arg] === 'String') {
                    options.args.push({
                        value: args[arg],
                        type: t.String
                    });
                } else if (args[arg].substring(0,4) == 'data'){ // Temporary Solution
                    console.log("Pushed Data");
                    options.args.push({
                        value: args[arg].substring(4),
                        type: t.String
                    });
                }
                else if (typeof args[arg] === 'string'){ // Temporary Solution
                    console.log("Pushed Address");
                    options.args.push({
                        value: args[arg],
                        type: t.Address
                    });
                }
                else if (typeof args[arg] === 'number'){ // Temporary Solution
                    console.log("Pushed num");
                    options.args.push({
                        value: args[arg],
                        type: t.UInt64
                    });
                }
                else {
                    options.args.push(args[arg]);
                }
            }
        }

        let flow = new Flow(env.config);
        let response = await flow.executeTransaction(DappTransactions[tx](env.imports), options);
        let resultData = await Flow.decode(response);
        console.log("postResponse: " + response)
        console.log("resultData: " + resultData)
        return {
            callAccount: proposer,
            callData: response
        }
    } 


    static async handleEvent(env, event, callback) {
        Flow.handleEvent(env, event, callback);
    } 

    static async createAccount(env, keyInfo) {
        /*  keyInfo : { entropy: byte array, weight: 1 ... 1000 }  */        
        let flow = new Flow(env);
        return await flow.createAccount(keyInfo);
    }

    static async deployContract(env, address, name, contract) {

        let flow = new Flow(env);
        return await flow.deployContract(address, name, contract);
    }

    static async getAccount(env, address) {
        let flow = new Flow(env);
        return await flow.getAccount(address);
    }

}
