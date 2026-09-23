import { apiService } from '../api/apiServices'
import type { IFeeOverview, IFeeTransaction } from '../types/dashboard'

export interface IFeeOrderPayload {
  feeType: string
  feeAmount: string
}

export const createOrderApi = async (payload: IFeeOrderPayload) => {
  const response = await apiService.post({
    url: `/create/order`,
    payload
  })
  return response
}

export const createPaymentLinkApi = async (userId: string, payload: IFeeOrderPayload) => {
  const response = await apiService.post({
    url: `/create-payment-link/${userId}`,
    payload
  })
  return response
}

export const getFeeOverviewApi = async (userId: string): Promise<{ data: IFeeOverview }> => {
  try {
    const response = await apiService.get(`/fees/details/${userId}`)
    if (response?.data) {
      return response
    }
  } catch (err) {
    console.warn('Backend /fees/details not available, using fallback:', err)
  }

  return {
    data: {
      totalTuitionFee: 120000,
      paidAmount: 90000,
      dueAmount: 3000,
      nextDueDate: 'Oct 05, 2026'
    }
  }
}

export const getFeeTransactionsApi = async (userId: string): Promise<{ data: IFeeTransaction[] }> => {
  try {
    const response = await apiService.get(`/fees/transactions/${userId}`)
    if (response?.data && Array.isArray(response.data)) {
      return response
    }
  } catch (err) {
    console.warn('Backend /fees/transactions not available, using fallback:', err)
  }

  return {
    data: [
      {
        transactionId: 'TXN-984210',
        feeType: 'Quarterly Installment #2',
        amount: 30000,
        status: 'PAID',
        paymentDate: 'Sept 01, 2026',
        paymentMethod: 'UPI / Online',
        receiptUrl: 'https://example.com/receipt/TXN-984210.pdf'
      },
      {
        transactionId: 'TXN-872341',
        feeType: 'Admission & Term 1 Tuition',
        amount: 60000,
        status: 'PAID',
        paymentDate: 'June 15, 2026',
        paymentMethod: 'Net Banking',
        receiptUrl: 'https://example.com/receipt/TXN-872341.pdf'
      }
    ]
  }
}

export const verifyPaymentApi = async (payload: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}) => {
  const response = await apiService.post({
    url: '/fees/verify-payment',
    payload
  })
  return response
}
