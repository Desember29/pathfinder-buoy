#include <iostream>
#include <string>
#include <vector>
#include "Functions.h"

using namespace std;

int main() {

	calculate_wave_height();

	system("PAUSE");
	return(0);
}

/*** test functions ****/

/*
int numData = 9;
int delta_t = 10;
double theta, phi;

vector<vector<double>> measured;
vector<double> vectPhi;

Read_to_array("CSV_test.csv", measured, numData);

//generate_simpsons_integrated_function(measured[5], vectPhi, delta_t);
generate_trapezoid_integrated_function(measured[5], vectPhi, delta_t);


for (int i = 0; i < vectPhi.size(); i++) {
cout << vectPhi[i] << endl;
}

phi = simpsons_integration_point_n(measured[5], measured[5].size(), delta_t);
theta = trapezoid_integration_point_n(measured[5], measured[5].size(), delta_t);

cout << "Phi has moved:" << phi << " Degrees" << endl;
cout << "Theta has moved:" << theta << " Degrees" << endl;
*/