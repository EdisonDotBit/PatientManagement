using EL;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;

namespace DAL
{
    public class PatientDAO
    {

        private readonly string connectionString = ConfigurationManager.ConnectionStrings["PatientManagement"].ConnectionString;

        public List<PatientDTO> GetPatients()
        {

            List<PatientDTO> patients = new List<PatientDTO>();


            using(SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "SELEC * FROM Patient";
                SqlCommand cmd = new SqlCommand(query, con);

                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();

                while(dr.Read())
                {
                    patients.Add(new PatientDTO
                    {
                        ID = (int)dr["Id"],
                        Patient = dr["Patient"].ToString(),
                        Drug = dr["Drug"].ToString(),
                        Dosage = (decimal)dr["Dosage"],
                        ModifiedDate = (DateTime)dr["ModifiedDate"]
                    });
                }
            }

            return patients;
        }
    }
}
