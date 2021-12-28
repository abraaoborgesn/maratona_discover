const Modal = {
    open() {
        //const novatrans = document.querySelector('.modal-overlay');
        //novatrans.classList.add('active');

        document.querySelector('.modal-overlay').classList.add('active')
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active')
        // adicionado depois, para limpar os campos quando clicar em cancelar
        Form.clearFields()
    }
}

const Storage = {
    get() {
        // transformando a string para uma array
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {

        //transformando o Objeto ou valor(array) em uma  string, pois o setItem precisa de 2 argumentos (O nome e o valor, sendo que o valor só aceita uma string). Para enviar para o localStorage(Observar no F12 e barrinha de aplication), do Chrome.
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
     all: Storage.get(),
    // [
    //     {
        
    //     description: 'Luz',
    //     amount: -50000,
    //     date: '23/01/2021',
    //     },
    //     {
        
    //     description: 'Website',
    //     amount: 500000,
    //     date: '23/01/2021',
    //     },
    //     {
        
    //     description: 'Internet',
    //     amount: 20000,
    //     date: '23/01/2021',
    //     },
    // ],

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


const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    
    addTransaction(transaction, index) {
        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        
        DOM.transactionsContainer.appendChild(tr)
    },
    

    innerHTMLTransaction(transaction, index){


        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        // const amount = transaction.amount.toLocaleString('pt-br',{style:'currency', currency: 'BRL'})

        const html = `        
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="assets/minus.svg" alt="Remover transação">
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


const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

        // console.log(signal + value)

        return signal + value
    },

    formatAmount(value) {
        value = Number(value.replace(/\,\./g, '')) * 100
        return value
    },

    formatDate(date) {
        const splittedDate  = date.split('-')
        // console.log(splittedDate)

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }

}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    
    validateFields(){
        const description = Form.getValues().description
        const amount = Form.getValues().amount
        const date = Form.getValues().date
        // console.log(description)

        if(description.trim() === '' || 
        amount.trim() === '' ||
        date.trim() === '') {
            throw new Error('Por favor, preencha todos os campos.');
        }
    },

    formatValues() {
        let description = Form.getValues().description
        let amount = Form.getValues().amount
        let date = Form.getValues().date

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description: description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    submit(event) {
        

        try {
            // Verificar se todas as informações foram preenchidas
            Form.validateFields()
            // Formatar os valores de amount e data
            const transaction = Form.formatValues()

            // Salvar/Adicionar na página inicial
            Transaction.add(transaction)

            // Limpar os dados do formulário
            Form.clearFields()

            // Fechar página do formulário
            Modal.close()

            
        } catch (error) {
            alert(error.message)
        }

        
        event.preventDefault()
        


    }

    
}


// DOM.addTransaction(transactions[0])
// DOM.addTransaction(transactions[1])
// DOM.addTransaction(transactions[2])



const App = {
    init() {
        Transaction.all.forEach((functionTransaction, index) => DOM.addTransaction(functionTransaction, index))
        DOM.updateBalance()

        Storage.set(Transaction.all)
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



