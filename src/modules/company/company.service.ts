import {
  Company,
  CompanyModel,
  CreateCompanyArgs,
  ListCompaniesArgs,
  ListCompaniesResponse,
  UpdateCompanyArgs,
} from '@modules/company'
import { throwError } from '@modules/error'

export const getCompany = async (id: string): Promise<Company | null> => {
  return CompanyModel.findById(id)
}

export const listCompanies = async ({
  name,
  limit,
  offset,
}: ListCompaniesArgs): Promise<ListCompaniesResponse> => {
  limit = limit || 10
  offset = offset || 0

  const options = {}
  if (name) options['name'] = { $eq: name }

  const data = await CompanyModel.find(options).skip(offset).limit(limit)
  const count = await CompanyModel.countDocuments(options)

  return { count, data }
}

export const createCompany = async ({
  name,
}: CreateCompanyArgs): Promise<Company | null> => {
  try {
    const newCompany = new CompanyModel({ name } as Company)

    const createdCompany = await newCompany.save()
    return createdCompany
  } catch (error) {
    return throwError('INTERNAL_ERROR')
  }
}

export const updateCompany = async ({
  _id,
  name,
}: UpdateCompanyArgs): Promise<Company | null> => {
  try {
    const company = await CompanyModel.findById(_id)
    if (!company) return throwError('NOT_FOUND')

    if (name) company.name = name

    await company.save()

    return company
  } catch (error) {
    return throwError('INTERNAL_ERROR')
  }
}
