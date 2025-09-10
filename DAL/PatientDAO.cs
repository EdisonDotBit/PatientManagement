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

        public List<PatientEntity> GetPatients()
        {

            List<PatientEntity> patients = new List<PatientEntity>();


            using(SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "SELECT * FROM PatientDetails";
                SqlCommand cmd = new SqlCommand(query, con);

                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();

                while(dr.Read())
                {
                    patients.Add(new PatientEntity
                    {
                        ID = (int)dr["ID"],
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
