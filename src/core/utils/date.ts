import dayjs from 'dayjs'

export const DATE_FORMAT = 'D.M.YYYY HH:mm'

export const formatDate = (date: any) => dayjs(date).format(DATE_FORMAT)
