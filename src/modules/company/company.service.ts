import {
  Company,
  CompanyModel,
  ListCompaniesArgs,
  ListCompaniesResponse,
  CreateCompanyArgs,
  UpdateCompanyArgs,
} from './'

export const getCompany = async (id: string): Promise<Company | null> => {
  return CompanyModel.findById(id)
}

export const listCompanies = async ({
  name,
  limit,
  offset,
}: ListCompaniesArgs): Promise<ListCompaniesResponse> => {
  const options = {}

  if (name) options['name'] = name

  limit = limit || 10
  offset = offset || 0

  const data = await CompanyModel.find(options)
    .skip(offset)
    .limit(limit)

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
    console.error('createCompany error', error)
    return null
  }
}

export const updateCompany = async ({
  _id,
  name,
}: UpdateCompanyArgs): Promise<Company | null> => {
  try {
    const company = await CompanyModel.findById(_id)
    if (!company) return null

    if (name) company.name = name

    await company.save()

    return company

  } catch (error) {
    console.error('updateCompany error', error)
    return null
  }
}
