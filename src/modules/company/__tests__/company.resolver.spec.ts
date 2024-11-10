import { ObjectId } from 'mongodb'

import {
  Company,
  CompanyResolver,
  CreateCompanyArgs,
  ListCompaniesArgs,
  UpdateCompanyArgs,
  createCompany,
  deleteCompany,
  getCompany,
  listCompanies,
  updateCompany,
} from '@modules/company'

jest.mock('@modules/company/company.service')

const mockCompany: Company = {
  _id: new ObjectId('64601311c4827118278a2d8b'),
  name: 'Test Company',
  createdAt: new Date(),
}

const mockCompanies = [
  {
    _id: new ObjectId('64601311c4827118278a2d8b'),
    name: 'Test Company',
    createdAt: new Date(),
  },
  {
    _id: new ObjectId('64601311c4827118278a2d8c'),
    name: 'Test Company 2',
    createdAt: new Date(),
  },
]

describe('CompanyResolver', () => {
  let resolver: CompanyResolver

  beforeEach(() => {
    resolver = new CompanyResolver()
    ;(getCompany as jest.Mock).mockReset()
    ;(listCompanies as jest.Mock).mockReset()
    ;(createCompany as jest.Mock).mockReset()
    ;(updateCompany as jest.Mock).mockReset()
    ;(deleteCompany as jest.Mock).mockReset()
  })

  it('should get a company by ID', async () => {
    ;(getCompany as jest.Mock).mockResolvedValue(mockCompany)
    const result = await resolver.getCompany('64601311c4827118278a2d8b')
    expect(result).toEqual(mockCompany)
    expect(getCompany).toHaveBeenCalledWith('64601311c4827118278a2d8b')
  })

  it('should return null if company not found', async () => {
    ;(getCompany as jest.Mock).mockResolvedValue(null)
    const result = await resolver.getCompany('invalid-id')
    expect(result).toBeNull()
    expect(getCompany).toHaveBeenCalledWith('invalid-id')
  })

  it('should list companies with given arguments', async () => {
    const args: ListCompaniesArgs = {
      first: 10,
    }
    ;(listCompanies as jest.Mock).mockResolvedValue({
      edges: mockCompanies.map((company) => ({
        node: company,
        cursor: company._id.toHexString(),
      })),
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: mockCompanies[0]._id.toHexString(),
        endCursor: mockCompanies[mockCompanies.length - 1]._id.toHexString(),
      },
      count: mockCompanies.length,
    })
    const result = await resolver.listCompanies(args)
    expect(result).toEqual({
      edges: mockCompanies.map((company) => ({
        node: company,
        cursor: company._id.toHexString(),
      })),
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: mockCompanies[0]._id.toHexString(),
        endCursor: mockCompanies[mockCompanies.length - 1]._id.toHexString(),
      },
      count: mockCompanies.length,
    })
    expect(listCompanies).toHaveBeenCalledWith(args)
  })

  it('should create a new company', async () => {
    const args: CreateCompanyArgs = { name: 'New Company' }
    ;(createCompany as jest.Mock).mockResolvedValue(mockCompany)
    const result = await resolver.createCompany(args)
    expect(result).toEqual(mockCompany)
    expect(createCompany).toHaveBeenCalledWith(args)
  })

  it('should return null if company creation fails', async () => {
    const args: CreateCompanyArgs = { name: 'New Company' }
    ;(createCompany as jest.Mock).mockResolvedValue(null)
    const result = await resolver.createCompany(args)
    expect(result).toBeNull()
    expect(createCompany).toHaveBeenCalledWith(args)
  })

  it('should update an existing company', async () => {
    const args: UpdateCompanyArgs = {
      _id: new ObjectId('64601311c4827118278a2d8b'),
      name: 'Updated Company',
    }
    ;(updateCompany as jest.Mock).mockResolvedValue(mockCompany)
    const result = await resolver.updateCompany(args)
    expect(result).toEqual(mockCompany)
    expect(updateCompany).toHaveBeenCalledWith(args)
  })

  it('should return null if company update fails', async () => {
    const args: UpdateCompanyArgs = {
      _id: new ObjectId(),
      name: 'Updated Company',
    }
    ;(updateCompany as jest.Mock).mockResolvedValue(null)
    const result = await resolver.updateCompany(args)
    expect(result).toBeNull()
    expect(updateCompany).toHaveBeenCalledWith(args)
  })

  it('should delete a company by ID', async () => {
    ;(deleteCompany as jest.Mock).mockResolvedValue(mockCompany)
    const result = await resolver.deleteCompany('64601311c4827118278a2d8b')
    expect(result).toEqual(mockCompany)
    expect(deleteCompany).toHaveBeenCalledWith('64601311c4827118278a2d8b')
  })

  it('should return null if company deletion fails', async () => {
    ;(deleteCompany as jest.Mock).mockResolvedValue(null)
    const result = await resolver.deleteCompany('invalid-id')
    expect(result).toBeNull()
    expect(deleteCompany).toHaveBeenCalledWith('invalid-id')
  })
})
