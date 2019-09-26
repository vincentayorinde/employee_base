const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// Persisting data


// Employee Type
const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields:() => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt},
        position: {type: GraphQLString}
    })
})
// Root Query
const RootQuery = new GraphQLObjectType({ 
    name: 'RootQueryType',
    fields:{
        employee: {
            type: EmployeeType,
            args: {
                id: {type: GraphQLString}
            },
        async resolve(parentValue, args){
                // for (let i = 0; i < employees.length; i++) {
                //     if(employees[i].id == args.id) {
                //         return employees[i];
                //     }
                // }
                const result = await axios.get('http://localhost:3000/employees/'+ args.id);
                return result.data;
                // return axios.get('http://localhost:3000/employees/'+ args.id)
                // .then(res => res.data)
            }
        },
        employees: {
            type: new GraphQLList(EmployeeType),
            async resolve(parentValue, args){
                const result = await axios.get('http://localhost:3000/employees');
                return result.data;
            }
        }
    }
})

// Mutations
const mutation = new GraphQLObjectType({
    name: 'mutation',
    fields: {
        addEmployee: {
            type: EmployeeType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                email: { type: new GraphQLNonNull(GraphQLString)},
                age: { type: new GraphQLNonNull(GraphQLInt)},
                position: { type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parentValue, args){
               const newEmployee = await axios.post('http://localhost:3000/employees', {
                   name: args.name,
                   email: args.email,
                   age: args.age,
                   position: args.position
               });
               return newEmployee.data

            }
        },
        deleteEmployee: {
            type: EmployeeType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parentValue, args){
               const employee = await axios.delete('http://localhost:3000/employees/'+args.id);
               return employee.data
            }
        },
        updateEmployee: {
            type: EmployeeType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString)},
                name: { type: GraphQLString},
                email: { type: GraphQLString},
                age: { type: GraphQLInt},
                position: { type: GraphQLString},
            },
            async resolve(parentValue, args){
               const updatedEmployee = await axios.patch('http://localhost:3000/employees/'+args.id, args);
               return updatedEmployee.data
            }
        },
    }
})
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});
