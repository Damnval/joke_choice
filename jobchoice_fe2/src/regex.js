export const fileTypes = ['image/png', 'image/jpeg', 'image/gif']
export const passwordRegex = RegExp(/^[a-z0-9]+$/i)
export const contactRegex = RegExp(/^(\+|\d)+(\-?\d+)*$/)
export const passRegex = RegExp(/[^A-Za-z0-9]/)
export const kanaRegex = RegExp(/^[ァ-ヴー ]+$/)
export const numRegex = RegExp(/[\d]/)
export const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+\=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/)
export const zipRegex = RegExp(/\-?\d+\.\d{1,10}/)
