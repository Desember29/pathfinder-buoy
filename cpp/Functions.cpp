#include <iostream>
#include <vector>
#include <cmath>
#include "Functions.h"

using std::cout; using std::vector; using std::endl;

void generate_simpsons_integrated_function(vector<double> &data_in, vector<double> &integrated_function, int delta_t) {
	int i;

	integrated_function.resize(data_in.size());

	for (i = 3; i <= data_in.size(); i += 2) {
		integrated_function[i-2] = simpsons_integration_point_n(data_in, i, delta_t);
	}

	/* Interpolate the function */
	for (i = 2; i < data_in.size() - 2; i += 2) {
		integrated_function[i] = (integrated_function[i - 1] + integrated_function[i + 1]) / 2;
	}
	
	integrated_function[i] = 2 * integrated_function[i - 1] - integrated_function[i - 2];
}

void generate_trapezoid_integrated_function(vector<double> &data_in, vector<double> &integrated_function, int delta_t) {
	int i;

	integrated_function.resize(data_in.size());

	for (i = 2; i < data_in.size() + 1; i++) {
		integrated_function[i-2] = trapezoid_integration_point_n(data_in, i, delta_t);
	}
	i = 100;
	/* Interpolate the last point */
	integrated_function[i] = (2 * integrated_function[i - 1] - integrated_function[i - 2]);
}

//Simpsons integration method.
double simpsons_integration(vector<double> &measured_points, double delta_t) {
	
	int vect_length;
	double sum = 0;											//The sum to be returned
	
	if (measured_points.size() % 2 == 0) {
		vect_length = measured_points.size();
	}
	else {
		vect_length = measured_points.size() - 1;			//If size() is odd, drop the last line	
	}
	
	double h = (double)delta_t / (double)vect_length;		//The step-width

	sum += measured_points[0] + measured_points[vect_length - 1];

	for (int i = 1; i < vect_length; i += 2) {
		sum += 4 * measured_points[i];
	}
	for (int i = 2; i < vect_length; i += 2) {
		sum += 2 * measured_points[i];
	}

	return((h*sum)/3);										//Return the final product
}

double simpsons_integration_point_n(vector<double> &measured, int point, int delta_t) {

	double sum = 0;
	double h = (double)delta_t / ((double)measured.size() - 1);		//The step-width

	if (point < 3) {
		cout << "Cannot integrate for n < 3" << endl;
		return 0;
	}
	else if (point % 2 == 0) {
		cout << "Cannot integrate for even points" << endl;
		return 0;
	}
	else {
		sum += measured[0] + measured[point - 1];

		for (int i = 1; i < point - 1; i += 2) {
			sum += 4 * measured[i];
		}
		for (int i = 2; i < point - 1; i += 2) {
			sum += 2 * measured[i];
		}

		return((h*sum)/3);
	}

}//End Simpsons_integration_point_n

double trapezoid_integration_point_n(vector<double> &data_in, int point, int delta_t) {
	double sum = 0;

	double h = (double)delta_t / ((double)data_in.size() - 1);

	for (int i = 0; i < point - 1; i++) {
		sum += h * (data_in[i] + data_in[i + 1]) / 2;
	}
	return(sum);
}

void calculate_time_step(int vectorLength, vector<double> &time_vector, int delta_t) {
	double timeStep;

	time_vector.resize(vectorLength);

	timeStep = (double)delta_t / (double)vectorLength;

	for (int i = 0; i < vectorLength; i++) {
		time_vector[i] = i * timeStep;
	}

}

void adjust_acceleration_offset(vector< vector<double> > &data_in, vector<double> &theta, vector<double> &phi, double accOffset) {
	int i;
	for (i = 0; i < data_in[2].size() - 1; i++) {
		data_in[2][i] = data_in[2][i] - (accOffset * sin(phi[i]) * cos(theta[i]));
		data_in[3][i] = data_in[3][i] - (accOffset * sin(theta[i]) * cos(phi[i]));
		data_in[4][i] = data_in[4][i] - (accOffset * cos(theta[i]) * cos(phi[i]));
	}
}