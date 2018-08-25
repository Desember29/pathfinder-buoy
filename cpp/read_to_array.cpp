#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include "Functions.h"

using namespace std;

void SkipBOM(ifstream &in);				//Function to skip UTF-8 BOM added by excel

void Read_to_array(string ReadFileName, vector<vector<double>> &measured, int numData) {

	int i, j;
	int numLines = 0;							//numData = number of different data points in file (e.g. x, y, z, date, time...)
	string str;

	ifstream inFile;
	
	inFile.open(ReadFileName);
	

	vector<string> header(numData);								//Used to temporary store the header

	numLines = count(istreambuf_iterator<char>(inFile), istreambuf_iterator<char>(), '\n');
												//Counts number of lines in the file (included header)
	inFile.clear();			
	inFile.seekg(ios::beg);
	SkipBOM(inFile);							//Sets file pointer to start, and skips UTF-8 BOM
	//cout << numLines << endl;					//For research purposes

	measured.resize(numData);

	for (i = 0; i < numData; i++) {				//Reserves memory for the total length of the vectors
		measured[i].reserve(numLines-1);		// -1 as header keeps the first line
	}//End for

	if (!inFile) {
		cout << "Unable to open file" << endl;
	}
	else {

		istringstream inStrStream;				//Creates an in string stream to keep each line
		string temp;							
		double tempFloat;						
		j = 0;

		while (getline(inFile, str)) {			//Gets the next line from the file
			i = 0;

			inStrStream.str(str);				//Sends the string to the in string stream

			while(getline(inStrStream, temp, ',')) {			//Splits the string at the next ,

				istringstream(temp) >> tempFloat;				//Converts the string to a float

				if (j == 0) {									//Checks if it's the first line
					header[i] = temp;							//If yes, adds to header
					//cout << header[i] << ',';
				}
				else {											//If not, adds to measured
					measured[i].push_back(tempFloat);
					//cout << measured[i][j-1] << ',';
				}//End if

				i++;
				
			}//End while inner
			
			inStrStream.clear();				//Clears the in string stream for the next line
			//cout << endl;
			j++;
		}//End while outer


	}//End if

	inFile.close();

	return;
}

void SkipBOM(std::ifstream &in)
{
	char test[3] = { 0 };
	in.read(test, 3);
	if ((unsigned char)test[0] == 0xEF &&
		(unsigned char)test[1] == 0xBB &&
		(unsigned char)test[2] == 0xBF)
	{
		return;
	}
	in.seekg(0);
}