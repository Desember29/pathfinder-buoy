#include <iostream>
#include <fstream>

#include "functions.h"

void write_to_file(vector<double> &wave_height, vector<double> &time) {
	std::ofstream outFile;

	outFile.open("wave_height.dat", std::ofstream::out | std::ofstream::trunc);
	//outFile.open("KochFractal.bin", std::ofstream::out | std::ofstream::trunc);

	for (int i = 0; i < wave_height.size(); i++) {
		outFile << time[i] << ' ' << wave_height[i] << '\n';
	}

	//for (auto& p : vectPoints) {
	//	outFile.write(reinterpret_cast<char*>(&p), 2 * sizeof(int));
	//}

	outFile.close();
}