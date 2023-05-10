#!/usr/bin/env ruby

input_table = $stdin.read

# Split the input table into rows
rows = input_table.split("\n").map(&:strip)

# Extract the header row and data rows
header, *data_rows = rows
data_rows.shift

# Extract attribute names
attribute_names = header.split('|').map(&:strip)

# Extract attribute data
attributes = data_rows.map do |row|
  attribute_data = row.split('|').map(&:strip)
  Hash[attribute_names.zip(attribute_data)]
end

# Generate LibAttributes Solidity code
puts <<-SOLIDITY
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Attribute, AttributeData } from "../codegen/tables/Attribute.sol";
import { AttributeTypes } from "../Types.sol";

import { getUniqueEntityId } from "../Utils.sol";

library LibAttributes {
  function createAttributes() internal pure returns (AttributeData[] memory) {
    AttributeData[] memory attributes = new AttributeData[](#{attributes.size});
SOLIDITY

attributes.each_with_index do |attribute, index|
  # Generate a Solidity struct for each attribute
  attribute_lines = attribute_names.map do |name|
    next if name.empty?
    next if %w(name properNoun itemType prefix suffix).include?(name)

    value = attribute[name]
    value = 0 if value.nil? || value.empty?

    value = value.to_i * 1000 if name.include? "stamina"

    "#{name}: #{value}"
  end.compact

  attribute_lines.push "attributeType: AttributeTypes.#{attribute["name"].capitalize}"

  puts "    attributes[#{index}] = AttributeData({"
  puts attribute_lines.join(",\n")
  puts "    });"
end

puts <<-SOLIDITY
    return attributes;
  }

  function getRandomAttribute(uint256 seed) internal returns (bytes32) {
    AttributeData[] memory attributes = createAttributes();

    uint256 attributeSeed = seed % attributes.length;
    AttributeData memory randomAttribute = attributes[attributeSeed];
    bytes32 id = getUniqueEntityId();

    Attribute.set(id, randomAttribute);

    return id;
  }
}
SOLIDITY
