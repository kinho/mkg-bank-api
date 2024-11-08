import { connectionFromArraySlice } from 'graphql-relay'

import {
  Company,
  CompanyConnection,
  CompanyModel,
  CreateCompanyArgs,
  ListCompaniesArgs,
  UpdateCompanyArgs,
} from '@modules/company'
import { throwError } from '@modules/error'
import { calculatePagination, mapToEdges } from '@modules/relay'

export const getCompany = async (id: string): Promise<Company | null> => {
  return CompanyModel.findById(id)
}

export const listCompanies = async (
  args: ListCompaniesArgs,
): Promise<CompanyConnection> => {
  const { name, first, after, last, before } = args

  const filter: Record<string, any> = {}
  if (name) filter['name'] = { $eq: name }

  const totalCount = await CompanyModel.countDocuments(filter)

  const { offset, limit } = calculatePagination(
    { first, last, after, before },
    totalCount,
  )

  const companies = await CompanyModel.find(filter).skip(offset).limit(limit)
  const edges = mapToEdges(companies, offset)

  const connection = connectionFromArraySlice(companies, args, {
    sliceStart: offset,
    arrayLength: totalCount,
  })

  return { ...connection, edges, totalCount }
}

export const createCompany = async ({
  name,
}: CreateCompanyArgs): Promise<Company | null> => {
  try {
    const newCompany = new CompanyModel({ name } as Company)

    return newCompany.save()
  } catch (error) {
    return throwError('INTERNAL_ERROR')
  }
}

export const updateCompany = async ({
  _id,
  name,
}: UpdateCompanyArgs): Promise<Company | null> => {
  const company = await CompanyModel.findById(_id)
  if (!company) return throwError('NOT_FOUND')

  try {
    if (name) company.name = name

    await company.save()

    return company
  } catch (error) {
    return throwError('INTERNAL_ERROR')
  }
}

export const deleteCompany = async (id: string): Promise<Company | null> => {
  const company = await CompanyModel.findById(id)
  if (!company) return throwError('NOT_FOUND')

  try {
    await company.deleteOne()

    return company
  } catch (error) {
    return throwError('INTERNAL_ERROR')
  }
}
