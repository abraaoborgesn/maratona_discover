const Modal = {
    open() {
        //const novatrans = document.querySelector('.modal-overlay');
        //novatrans.classList.add('active');

        document.querySelector('.modal-overlay').classList.add('active')
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}

const transactions = [
    {
    
    description: 'Luz',
    amount: -50000,
    date: '23/01/2021',
    },
    {
    
    description: 'Website',
    amount: 500000,
    date: '23/01/2021',
    },
    {
    
    description: 'Internet',
    amount: 20000,
    date: '23/01/2021',
    },
]
const Transaction = {
    all: transactions,
    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => { 
            if(transaction.amount > 0) {
            income += transaction.amount;
            }
        })
        return income;
    },

    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => { 
            if(transaction.amount < 0) {
            expense += transaction.amount;
            }
        })
        return expense;
    },

    total() {

        let total = Transaction.incomes() + Transaction.expenses()

        return total;
    }
}

const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

        // console.log(signal + value)

        return signal + value
    }


}


const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    
    addTransaction(transaction) {
        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        
        DOM.transactionsContainer.appendChild(tr)
    },
    

    innerHTMLTransaction(transaction){


        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        // const amount = transaction.amount.toLocaleString('pt-br',{style:'currency', currency: 'BRL'})

        const html = `        
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="assets/minus.svg" alt="Remover transação">
            </td>
                    
        `
        return html
    },

    updateBalance() {
        document.querySelector('#incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.querySelector('#expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.querySelector('#totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },
    
    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ''
    }
}

// DOM.addTransaction(transactions[0])
// DOM.addTransaction(transactions[1])
// DOM.addTransaction(transactions[2])

const App = {
    init() {
        Transaction.all.forEach(functionTransaction => DOM.addTransaction(functionTransaction))
        DOM.updateBalance()
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}


App.init()

// Transaction.add({
    
//     description: 'Projeto',
//     amount: 500000,
//     date: '23/06/21'

// })



