import { Dayjs } from 'dayjs'
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs'
import generatePicker from 'antd/lib/date-picker/generatePicker'

export let DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig)

export type DatePickerProps = React.ComponentProps<typeof DatePicker>
