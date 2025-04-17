const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API',()=>{

    beforeAll(async ()=>{
       await mongoConnect()
    })
    afterAll(async()=>{
        mongoDisconnect()
    })
    describe('Test GET /launches',()=>{
        test('It should responed with status code 200',async ()=>{
           const response = await request(app).get('/v1/launches').expect('Content-Type',/json/).expect(200);
        })
    })
    
    describe("Test POST /launches",()=>{
        const completeLaunchData = {
            mission:"USS Enterprise",
            rocket:"NCC 1701-D",
            target:"Kepler-186 f",
            launchDate:"January 4, 2028"
        }
        const launchesDataWithInvaildDate = {
            mission:"USS Enterprise",
            rocket:"NCC 1701-D",
            target:"Kepler-186 f",
            launchDate:"jump"
        }
        const launchDataWithoutDate ={
            mission:"USS Enterprise",
            rocket:"NCC 1701-D",
            target:"Kepler-186 f",
        }
        test("It should responed with status code 201",async ()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(completeLaunchData)
            .expect('Content-Type',/json/)
            .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();// the date i send to test
            const responseDate = new Date(response.body.launchDate).valueOf();// the date i recieved from test
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
    
            // response.body.launchDate = new Date(response.body.launchDate).valueOf()
            // expect(response.body).toMatchObject(completeLaunchData)
        })
        test("It should catch missing required properties",async()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type',/json/)
            .expect(400)
            expect(response.body).toStrictEqual({
                error:'Missing required launch property'
            })
        })
        test("It should catch invaild date",async()=>{
            const reponse = await request(app)
            .post('/v1/launches')
            .send(launchesDataWithInvaildDate)
            .expect('Content-Type',/json/)
            .expect(400);
           expect(reponse.body).toStrictEqual({
            error:"Invaild date"
           }) 
        })
        
    })
})