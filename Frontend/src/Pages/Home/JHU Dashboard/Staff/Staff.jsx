import "../../style.css";
import SideBar from "../../SideBar";

function Staff() {


  const employeeData = [
    {
      id: "EMP001",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      gender: "Male",
      age: 30,
      dateOfEmployment: "2020-01-15",
      phoneNumber: "123-456-7890"
    },
    {
      id: "EMP002",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      gender: "Female",
      age: 28,
      dateOfEmployment: "2019-03-22",
      phoneNumber: "987-654-3210"
    }
  ];

  return (
    <div className="Home">
      <SideBar />

      <section className="home-section">
        <div className="home-content">
          <i className='bx bx-menu'></i>
        </div>

        {/* Employee Table */}
        <div className="table-container">
          <h2>Employee Records</h2>
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Date of Employment</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.age}</td>
                  <td>{employee.dateOfEmployment}</td>
                  <td>{employee.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Staff;