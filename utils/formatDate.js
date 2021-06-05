export default function formatDate(dateStr) {
    if (!dateStr) { return '' }
    const month = parseInt(dateStr.slice(0, 2))
    const day = parseInt(dateStr.slice(2, 4))
    const year = dateStr.slice(4, 6)
    return new Date(`${month}/${day}/20${year}`)
}