function getMonthName(month){
    const d = new Date()
    d.setMonth(month - 1)
    const monthName = d.toLocaleString('default', {month: 'long'})
    return monthName
}

export default function formatDate(dateStr) {
    if (!dateStr) return ''
    const month = parseInt(dateStr.slice(0, 2)) - 1
    const monthName = getMonthName(month)
    const day = parseInt(dateStr.slice(2, 4))
    const year = dateStr.slice(4, 6)
    // return `${monthName} 20${year}`
    const dateObject = new Date(`20${year}`, month, day)
    // console.log('dateObject: ', dateObject)
    return {
        dateObject: dateObject,
        monthAndYear: `${monthName} ${dateObject.getFullYear()}`
    }
}