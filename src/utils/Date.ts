import moment from 'moment';

export const DEFAULT_DATE_FORMAT = 'DD MMMM,YYYY';

export const dateFormatter = (value: Date, outputFormat = DEFAULT_DATE_FORMAT, inputFormat = '') =>
    value ? moment(value, inputFormat).format(outputFormat) : '';