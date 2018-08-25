#ifndef FUNCTIONS_H
#define FUNCTIONS_H

#include <vector>

using std::vector;
using std::string;

void calculate_wave_height();


void generate_simpsons_integrated_function(vector<double> &data_in, vector<double> &integrated_function, int delta_t);
void generate_trapezoid_integrated_function(vector<double> &data_in, vector<double> &integrated_function, int delta_t);

double simpsons_integration(vector<double> &measured_points, double delta_t);
double simpsons_integration_point_n(vector<double> &measured, int point, int delta_t);
double trapezoid_integration_point_n(vector<double> &data_in, int point, int delta_t);

void adjust_acceleration_offset(vector< vector<double> > &data_in, vector<double> &theta, vector<double> &phi, double accOffset);
void calculate_time_step(int vectorLength, vector<double> &time_vector, int delta_t);

void Read_to_array(string ReadFileName, vector<vector<double>> &measured, int numData);
void write_to_file(vector<double> &wave_height, vector<double> &time);

#endif