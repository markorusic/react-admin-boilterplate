import dayjs from 'dayjs'

export let DATE_FORMAT = 'D.M.YYYY HH:mm'

export let formatDate = (date: any) => dayjs(date).format(DATE_FORMAT)
