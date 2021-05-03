export default function formatDate(dateStr) {
    const month = dateStr.slice(0, 2)
    const day = dateStr.slice(2, 4)
    const year = dateStr.slice(4, 6)
    console.log(`month: `, month)
    console.log(`day: `, day)
    console.log(`year: `, year)
    return `${month}/${day}/20${year}`
}