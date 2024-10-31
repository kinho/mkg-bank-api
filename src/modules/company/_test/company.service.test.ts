import 'reflect-metadata'
import { ObjectId } from 'mongodb'

import MongoDBConnection from '@config/mongodb'
import {
  Company,
  CompanyModel,
  CreateCompanyArgs,
  ListCompaniesArgs,
  UpdateCompanyArgs,
  createCompany,
  getCompany,
  listCompanies,
  updateCompany,
} from '@modules/company'

describe('CompanyService', () => {
  beforeAll(async () => {
    await MongoDBConnection.connect({ testEnv: true })
  })

  afterAll(async () => {
    await MongoDBConnection.disconnect()
  })

  beforeEach(async () => {
    await CompanyModel.deleteMany({})
  })

  describe('getCompany', () => {
    it('should retrieve a company by ID', async () => {
      const company = await new CompanyModel({
        name: 'Test Company',
      }).save()

      const retrievedCompany = await getCompany(company._id.toString())

      expect(retrievedCompany).toBeDefined()
      expect(retrievedCompany?._id.toString()).toBe(company._id.toString())
      expect(retrievedCompany?.name).toBe('Test Company')
    })

    it('should return null if company not found', async () => {
      const retrievedCompany = await getCompany('64601311c4827118278a2d8b')

      expect(retrievedCompany).toBeNull()
    })
  })

  describe('listCompanies', () => {
    it('should list all companies', async () => {
      await new CompanyModel({ name: 'Test Company 1' }).save()
      await new CompanyModel({ name: 'Test Company 2' }).save()

      const { data: companies } = await listCompanies({})

      expect(companies.length).toBe(2)
    })

    it('should list companies with limit and offset', async () => {
      await new CompanyModel({ name: 'Test Company 1' }).save()
      await new CompanyModel({ name: 'Test Company 2' }).save()
      await new CompanyModel({ name: 'Test Company 3' }).save()

      const args: ListCompaniesArgs = { limit: 2, offset: 1 }
      const { data: companies } = await listCompanies(args)

      expect(companies.length).toBe(2)
      expect(companies[0].name).toBe('Test Company 2')
      expect(companies[1].name).toBe('Test Company 3')
    })

    it('should list companies by name', async () => {
      await new CompanyModel({ name: 'Test Company 1' }).save()
      await new CompanyModel({ name: 'Other Company' }).save()

      const args: ListCompaniesArgs = { name: 'Test Company 1' }
      const { data: companies } = await listCompanies(args)

      expect(companies.length).toBe(1)
      expect(companies[0].name).toBe('Test Company 1')
    })
  })

  describe('createCompany', () => {
    it('should create a new company', async () => {
      const args: CreateCompanyArgs = { name: 'New Company' }
      const company: Company | null = await createCompany(args)

      expect(company).toBeDefined()
      expect(company?.name).toBe('New Company')
    })
  })

  describe('updateCompany', () => {
    it('should update an existing company', async () => {
      const company = await new CompanyModel({
        name: 'Test Company',
      }).save()

      const args: UpdateCompanyArgs = {
        _id: company._id,
        name: 'Updated Company',
      }

      const updatedCompany = await updateCompany(args)

      expect(updatedCompany).toBeDefined()
      expect(updatedCompany?._id.toString()).toBe(company._id.toString())
      expect(updatedCompany?.name).toBe('Updated Company')
    })

    it('should return null if company not found', async () => {
      const args: UpdateCompanyArgs = {
        _id: new ObjectId('64601311c4827118278a2d8b'),
        name: 'Updated Company',
      }

      const updatedCompany = await updateCompany(args)

      expect(updatedCompany).toBeNull()
    })
  })
})
