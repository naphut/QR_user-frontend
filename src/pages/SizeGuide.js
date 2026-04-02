import React from 'react';

const SizeGuide = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Size Guide</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Men's Clothing Size Chart</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chest (inches)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waist (inches)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hip (inches)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr><td className="px-6 py-4">S</td><td>34-36</td><td>28-30</td><td>34-36</td></tr>
              <tr><td className="px-6 py-4">M</td><td>38-40</td><td>32-34</td><td>38-40</td></tr>
              <tr><td className="px-6 py-4">L</td><td>42-44</td><td>36-38</td><td>42-44</td></tr>
              <tr><td className="px-6 py-4">XL</td><td>46-48</td><td>40-42</td><td>46-48</td></tr>
              <tr><td className="px-6 py-4">XXL</td><td>50-52</td><td>44-46</td><td>50-52</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;