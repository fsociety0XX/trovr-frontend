export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.{8,})/
export const nameRegex = /^[a-zA-Z ](?:['\a-zA-Z ]*[a-zA-Z ])$/
export const numberRegx = /^\d*$/
export const onlyAlphaNumericValues = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/
export const multiPostCodeRegx = /^[^,][a-zA-Z, 0-9]+( [a-zA-Z, 0-9][^,])*$/
export const imageURLRegx = /(https?:\/\/.*\.(?:png|jpg|JPG|PNG|svg))/
export const phoneRegex = /^[0-9]{0,15}$/
export const dateTimeRegex = /^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}$/
export const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
export const postcodeRegx = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/
export const defaultImage =
  'https://trovr-local.s3.amazonaws.com/uploads/profile-image.png'
export const AWS_CONFIG = {
  bucketName: process.env.AWS_BUCKET_NAME,
  dirName: process.env.AWS_DIRECTORY_NAME,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.AWS_SCERET_ACCESS_KEY,
  s3Url: process.env.AWS_S3_URL,
}

export const dropdownOptions = [
  { key: 'week', text: 'last week', value: 'week' },
  { key: 'month', text: 'last month', value: 'month' },
  { key: 'year', text: 'last year', value: 'year' },
]

export const actionTypeOptions = [
  {
    key: 'RedeemedBarcode',
    value: 'RedeemedBarcode',
    text: 'Redeemed Barcode',
  },
  { key: 'RedeemedBrand', value: 'RedeemedBrand', text: 'Redeemed Brand' },
  {
    key: 'RegisterBankCard',
    value: 'RegisterBankCard',
    text: 'Register Bank/Card',
  },
  { key: 'RedeemViaBank', value: 'RedeemViaBank', text: 'Redeem Via Bank' },
  {
    key: 'RedeemViaCharity',
    value: 'RedeemViaCharity',
    text: 'Redeem Via Charity',
  },
  { key: 'RedeemViaTill', value: 'RedeemViaTill', text: 'Redeem Via Till' },
  { key: 'FailedRedeem', value: 'FailedRedeem', text: 'Failed Redeem' },
  { key: 'VoucherGift', value: 'VoucherGift', text: 'Voucher Gift' },
  {
    key: 'VoucherPurchase',
    value: 'VoucherPurchase',
    text: 'Voucher Purchase',
  },
  {
    key: 'VoucherPostcode',
    value: 'VoucherPostcode',
    text: 'Voucher Postcode',
  },
  {
    key: 'VoucherCampaignName',
    value: 'VoucherCampaignName',
    text: 'Voucher Campaign Name',
  },
]
