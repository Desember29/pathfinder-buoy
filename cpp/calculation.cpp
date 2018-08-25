#include "Functions.h"

#include <string>
#include <cmath>

using std::string;

#define NUMDATA 9;
#define DELTA_T 10;
#define DELTA_H_AVERAGE 9.81;
#define FILENAME "CSV_test.csv";


void calculate_wave_height() {
	int numData = NUMDATA;
	int delta_t = DELTA_T;
	int delta_h_average = DELTA_H_AVERAGE;
	string readFileName = FILENAME;

	int i, j;

	vector< vector<double> > data_in;
	vector< vector<double> > temp_integrated;
	vector< vector<double> > delta_coord;
	vector< vector<double> > wave_height;

	wave_height.resize(7);					//0: wave height, 1: x, 2: y, 3: z, 4: theta, 5: phi, 6: t.
	temp_integrated.resize(3);				//Step-holder for x-,y-,z-coordinate integration.
	delta_coord.resize(3);					//step-holder for delta- x, y, z.

	Read_to_array(readFileName, data_in, numData);

	/**** CALCULATE theta, phi ****/
	for (i = 0; i < 2; i++) {
		generate_simpsons_integrated_function(data_in[i + 5], wave_height[i + 4], delta_t);
	}
	/* Theta and phi calculated for points 3-> */
	/**** END CALCULATE theta, phi ****/

	adjust_acceleration_offset(data_in, wave_height[4], wave_height[5], delta_h_average);

	/**** CALCULATE x, y, z ****/
	for (i = 0; i < 3; i++) {
		generate_simpsons_integrated_function(data_in[i + 2], temp_integrated[i], delta_t);
	}

	for (i = 0; i < 3; i++) {
		generate_trapezoid_integrated_function(temp_integrated[i], wave_height[i + 1], delta_t);
	}
	/* x, y, and z-coordinates are calculate for points 4-> */
	/**** END CALCULATE x, y, z ****/

	/**** CALCULATE DELTA x, y, z ****/
	for (i = 0; i < 3; i++) {
		delta_coord[i].resize(wave_height[i + 1].size());
		for (j = 0; j < delta_coord[i].size(); j++) {
			if (j == 0) {
				delta_coord[i][j] = 0;
			}
			else {
				delta_coord[i][j] = wave_height[i + 1][j] - wave_height[i + 1][j - 1];
			}
		}
	}
	/**** END CALCULATE DELTA x, y, z ****/



	for (i = 0; i < wave_height[1].size(); i++) {
		wave_height[0].push_back(
			delta_coord[0][i] * cos(wave_height[4][i]) * sin(wave_height[5][i]) +
			delta_coord[1][i] * sin(wave_height[4][i]) * cos(wave_height[5][i]) +
			delta_coord[2][i] * cos(wave_height[4][i]) * cos(wave_height[5][i])
		);
	}

	calculate_time_step(wave_height[5].size(), wave_height[6], delta_t);

	write_to_file(wave_height[0], wave_height[6]);

}