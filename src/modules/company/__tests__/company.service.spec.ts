import { GraphQLError } from 'graphql'
import { ObjectId } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, disconnect } from 'mongoose'

import {
  CompanyModel,
  createCompany,
  deleteCompany,
  getCompany,
  listCompanies,
  updateCompany,
} from '@modules/company'

describe('CompanyService Tests', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await connect(mongoServer.getUri())
  })

  afterAll(async () => {
    await disconnect()
    await mongoServer.stop()
  })

  afterEach(async () => {
    await CompanyModel.deleteMany({})
  })

  it('should create a new company', async () => {
    const company = await createCompany({ name: 'Test Company' })

    expect(company).not.toBeNull()
    expect(company).toHaveProperty('_id')
    expect(company?.name).toBe('Test Company')
  })

  it('should retrieve a company by ID', async () => {
    const company = await createCompany({ name: 'Retrieve Company' })
    const foundCompany = await getCompany(company!._id.toString())

    expect(foundCompany).not.toBeNull()
    expect(foundCompany?.name).toBe('Retrieve Company')
  })

  it('should return null if company not found', async () => {
    const foundCompany = await getCompany(new ObjectId().toString())

    expect(foundCompany).toBeNull()
  })

  it('should list companies with optional filters', async () => {
    await createCompany({ name: 'Company A' })
    await createCompany({ name: 'Company B' })

    const result = await listCompanies({ first: 10 })
    expect(result).toHaveProperty('totalCount')
    expect(result.totalCount).toBeGreaterThanOrEqual(2)
    expect(result.edges.length).toBe(2)
  })

  it('should list companies with empty filters', async () => {
    await createCompany({ name: 'Company A' })
    await createCompany({ name: 'Company B' })

    const result = await listCompanies({})
    expect(result).toHaveProperty('totalCount')
    expect(result.totalCount).toBeGreaterThanOrEqual(2)
    expect(result.edges.length).toBe(2)
  })

  it('should update an existing company', async () => {
    const company = await createCompany({ name: 'Old Name' })

    const updatedCompany = await updateCompany({
      _id: company!._id,
      name: 'Updated Name',
    })

    expect(updatedCompany).not.toBeNull()
    expect(updatedCompany?.name).toBe('Updated Name')
  })

  it('should throw an ApolloError when updating a non-existing company', async () => {
    const nonExistingId = new ObjectId('507f191e810c19729de860ea')

    await expect(
      updateCompany({
        _id: nonExistingId,
        name: 'Non-existing Company',
      }),
    ).rejects.toThrowError(GraphQLError)
  })

  it('should delete a company by ID', async () => {
    const company = await createCompany({ name: 'Company to Delete' })
    const deletedCompany = await deleteCompany(company!._id.toString())

    expect(deletedCompany).not.toBeNull()
    expect(deletedCompany?._id.toString()).toBe(company?._id.toString())

    const result = await getCompany(company!._id.toString())
    expect(result).toBeNull()
  })

  it('should throw an ApolloError when deleting a non-existing company', async () => {
    const nonExistingId = new ObjectId()

    await expect(deleteCompany(nonExistingId.toString())).rejects.toThrowError(
      GraphQLError,
    )
  })
})
