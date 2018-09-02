formatData = (apiInfo) => {
    let data = {}

    for (let i = 0; i < apiInfo.length; i++) {
        let invoice = apiInfo[i]
        let name = invoice.Contact.Name
        let date = invoice.DateString

        if (!data.hasOwnProperty(name)) data[name] = {
            total: 0,
            name,
            dates: []
        }

        if (!data[name]['dates'].hasOwnProperty(date)) {
            data[name]['dates'][date] = {
                total: 0,
                invoices: []
            }
        }

        data[name].total += Number(invoice.Total)
        data[name]['dates'][date].total += Number(invoice.Total)
        data[name]['dates'][date].invoices.push(invoice)
    }


    let names = Object.keys(data)

    names.forEach(name => {
        let dates = Object.keys(data[name].dates)
        data[name].datesList = dates.map(date => {

            data[name]['dates'][date].date = date
            return data[name]['dates'][date]
        })
    })
    return data
}

module.exports = {
    formatData: formatData
}