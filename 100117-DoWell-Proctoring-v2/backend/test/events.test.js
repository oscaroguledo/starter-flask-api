async function setup() {
    const chaiModule = await import('chai');
    const supertestModule = await import('supertest');
    const chai = chaiModule.default || chaiModule;
    const supertest = supertestModule.default || supertestModule;

    const expect = chai.expect;
    return { expect, supertest };
}

describe('Event API Tests', function () {
    let request, expect, eventId;

    before(async function () {
        const { expect: localexpect, supertest } = await setup();
        expect = localexpect;
        request = supertest("http://localhost:5000");
    });

    // Test for creating an event
    it('should create an event', async function () {
        const response = await request.post('/api/v1/events/new')
            .send({
                name: "New meeting",
                start_time: "2024-04-01T09:00:00.000Z",
                close_date: "2024-04-01T09:00:00.000Z",
                duration_in_hours: 3,
                user_id: "user_1234543",
                participants: [],
                active_participants: [],
                max_cap: 50,
                link: "http://abc.com/meeting"
            });

        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
        expect(response.body.data).to.have.property('_id');
        expect(response.body.data).to.have.property('registration_end_date');
        // console.log("auto generated registration end date >> ", response.body.data.registration_end_date);
        eventId = response.body.data._id;
    });

    it('should get all events', async function () {
        const res = await request.get('/api/v1/events/all');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
    });

    // Test for getting a single event by ID
    it('should get an event by id', async function () {
        const res = await request.get(`/api/v1/events/${eventId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.have.property('_id', eventId);
    });

    // Test for updating an event
    it('should update an event', async function () {
        const res = await request.patch(`/api/v1/events/${eventId}`)
            .send({ 
                max_cap: 100,
                registration_end_date: "2024-04-01T03:00:00.000Z"
             });
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.have.property('max_cap', 100);
        expect(res.body.data).to.have.property('registration_end_date', "2024-04-01T03:00:00.000Z");
        // console.log("updated registration date >> ", res.body.data.registration_end_date)
    });

    // Test for deleting an event
    it('should delete an event', async function () {
        const res = await request.delete(`/api/v1/events/${eventId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Event deleted successfully');
    });
});
