
function setup() {
  createCanvas(1050, 625);
}

function draw() {
  // inputs
  var solids_throughput = Number(document.getElementById("st").value);
  var liquid_throughput = Number(document.getElementById("lt").value);
  var slurry_throughput = Number(document.getElementById("mt").value);
  var solids_density = Number(document.getElementById("sd").value);
  var liquid_density = Number(document.getElementById("ld").value);
  var slurry_density = Number(document.getElementById("md").value);
  var solids_flow = Number(document.getElementById("sf").value);
  var liquid_flow = Number(document.getElementById("lf").value);
  var slurry_flow = Number(document.getElementById("mf").value);
  var mass_concentration = Number(document.getElementById("mc").value) / 100;
  var volume_concentration = Number(document.getElementById("vc").value) / 100;

  // define known and unkown
  let unknown = {
    solids_throughput: solids_throughput,
    liquid_throughput: liquid_throughput,
    slurry_throughput: slurry_throughput,
    solids_density: solids_density,
    liquid_density: liquid_density,
    slurry_density: slurry_density,
    solids_flow: solids_flow,
    liquid_flow: liquid_flow,
    slurry_flow: slurry_flow,
    mass_concentration: mass_concentration,
    volume_concentration: volume_concentration,
  };

  // populate known and update unknown dictionary
  let known = {};
  for (var key in unknown) {
    if (unknown.hasOwnProperty(key)) {
      if (unknown[key] != 0) {
        unknown, known = update_lists(unknown, known, key);
      }
    }
  }

  // calculate unknowns
  let count = 0;
  while (Object.keys(unknown).length > 0 && count < 10) {
    for (var key in unknown) {
      if (unknown.hasOwnProperty(key)) {

        if (key == 'solids_throughput') {
          if (slurry_throughput != 0 && mass_concentration != 0) {
            solids_throughput = slurry_throughput * mass_concentration;
            unknown[key] = solids_throughput;
            unknown, known = update_lists(unknown, known, key);
          } else if (solids_density != 0 && solids_flow != 0) {
            solids_throughput = solids_density / 1000 * solids_flow;
            unknown[key] = solids_throughput;
            unknown, known = update_lists(unknown, known, key);
          } else if (mass_concentration != 0 && liquid_throughput != 0) {
            solids_throughput = mass_concentration * liquid_throughput / (1 - mass_concentration);
            unknown[key] = solids_throughput;
            unknown, known = update_lists(unknown, known, key);
          }
        }

        if (key == 'liquid_throughput') {
          if (slurry_throughput != 0 && solids_throughput != 0) {
            liquid_throughput = slurry_throughput - solids_throughput;
            unknown[key] = liquid_throughput;
            unknown, known = update_lists(unknown, known, key);
          } else if (liquid_density != 0 && liquid_flow != 0) {
            liquid_throughput = liquid_density / 1000 * liquid_flow;
            unknown[key] = liquid_throughput;
            unknown, known = update_lists(unknown, known, key);
          } else if (solids_throughput != 0 && mass_concentration != 0) {
            liquid_throughput = solids_throughput / mass_concentration - solids_throughput;
            unknown[key] = liquid_throughput;
            unknown, known = update_lists(unknown, known, key);
          }
        }

        if (key == 'slurry_throughput') {
          if (solids_throughput != 0 && liquid_throughput != 0) {
            slurry_throughput = solids_throughput + liquid_throughput;
            unknown[key] = slurry_throughput;
            unknown, known = update_lists(unknown, known, key);
          } else if (solids_throughput != 0 && mass_concentration != 0) {
            slurry_throughput = solids_throughput / mass_concentration;
            unknown[key] = slurry_throughput;
            unknown, known = update_lists(unknown, known, key);
          } else if (slurry_density != 0 && slurry_flow != 0) {
            slurry_throughput = slurry_density / 1000 * slurry_flow;
            unknown[key] = slurry_throughput;
            unknown, known = update_lists(unknown, known, key);
          }
        }

        if (key == 'solids_flow') {
          if (slurry_flow != 0 && liquid_flow != 0) {
            solids_flow = slurry_flow - liquid_flow;
            unknown[key] = solids_flow;
            unknown, known = update_lists(unknown, known, key);
          } else if (solids_throughput != 0 && solids_density != 0) {
            solids_flow = solids_throughput * 1000 / solids_density;
            unknown[key] = solids_flow;
            unknown, known = update_lists(unknown, known, key);
          } else if (slurry_flow != 0 && volume_concentration != 0) {
            solids_flow = slurry_flow * volume_concentration;
            unknown[key] = solids_flow;
            unknown, known = update_lists(unknown, known, key);
          }
        }

        if (key == 'liquid_flow') {
          if (slurry_flow != 0 && solids_flow != 0) {
            liquid_flow = slurry_flow - solids_flow;
            unknown[key] = liquid_flow;
            unknown, known = update_lists(unknown, known, key);
          } else if (liquid_throughput != 0 && liquid_density != 0) {
            liquid_flow = liquid_throughput * 1000 / liquid_density;
            unknown[key] = liquid_flow;
            unknown, known = update_lists(unknown, known, key);
          } else if (solids_flow != 0 && volume_concentration != 0) {
            liquid_flow = solids_flow / volume_concentration - solids_flow;
            unknown[key] = liquid_flow;
            unknown, known = update_lists(unknown, known, key);
          }
        }

        if (key == 'slurry_flow') {
          if (solids_flow != 0 && liquid_flow != 0) {
            slurry_flow = solids_flow + liquid_flow;
            unknown[key] = slurry_flow;
            unknown, known = update_lists(unknown, known, key);
          } else if (slurry_throughput != 0 && slurry_density != 0) {
            slurry_flow = slurry_throughput * 1000 / slurry_density;
            unknown[key] = slurry_flow;
            unknown, known = update_lists(unknown, known, key);
          } else if (liquid_flow != 0 && volume_concentration != 0) {
            slurry_flow = liquid_flow / (1 - volume_concentration);
            unknown[key] = slurry_flow;
            unknown, known = update_lists(unknown, known, key);
          }
        }

        if (key == 'solids_density') {
          if (liquid_density != 0 && volume_concentration != 0 && mass_concentration != 0) {
            solids_density = ((liquid_density / volume_concentration) - liquid_density) / ((1 / mass_concentration) - 1);
            unknown[key] = solids_density;
            unknown, known = update_lists(unknown, known, key);
          } else if (slurry_density != 0 && liquid_density != 0 && volume_concentration != 0) {
            solids_density = ((slurry_density - liquid_density) / volume_concentration) + liquid_density;
            unknown[key] = solids_density;
            unknown, known = update_lists(unknown, known, key);
          } else if (mass_concentration != 0 && liquid_density != 0 && volume_concentration != 0) {
            solids_density = (mass_concentration * (liquid_density / volume_concentration - liquid_density)) / (1 - mass_concentration);
            unknown[key] = solids_density;
            unknown, known = update_lists(unknown, known, key);
          } else if (mass_concentration != 0 && slurry_density != 0 && liquid_density != 0) {
            solids_density = (mass_concentration * slurry_density * liquid_density) / ((mass_concentration * slurry_density) - (slurry_density - liquid_density));
            unknown[key] = solids_density;
            unknown, known = update_lists(unknown, known, key);
          } else if (slurry_density != 0 && liquid_density != 0 && volume_concentration != 0) {
            solids_density = (slurry_density - liquid_density) / volume_concentration + liquid_density;
            unknown[key] = solids_density;
            unknown, known = update_lists(unknown, known, key);
          } else if (solids_throughput != 0 && solids_flow != 0) {
            solids_density = solids_throughput * 1000 / solids_flow;
            unknown[key] = solids_density;
            unknown, known = update_lists(unknown, known, key);
          }
        }

        if (key == 'liquid_density') {
          if (mass_concentration != 0 && slurry_density != 0 && solids_density != 0) {
            liquid_density = ((mass_concentration - 1) * slurry_density * solids_density) / (mass_concentration * slurry_density - solids_density);
            unknown[key] = liquid_density;
            unknown, known = update_lists(unknown, known, key);
          } else if (solids_density != 0 && mass_concentration != 0 && volume_concentration != 0) {
            liquid_density = (solids_density * (1 - mass_concentration)) / (mass_concentration * (1 / volume_concentration - 1));
            unknown[key] = liquid_density;
            unknown, known = update_lists(unknown, known, key);
          } else if (slurry_density != 0 && solids_density != 0 && volume_concentration != 0) {
            liquid_density = (slurry_density - solids_density * volume_concentration) / (1 - volume_concentration);
            unknown[key] = liquid_density;
            unknown, known = update_lists(unknown, known, key);
          } else if (slurry_density != 0 && volume_concentration != 0 && mass_concentration != 0) {
            liquid_density = slurry_density / (1 + volume_concentration * ((mass_concentration / volume_concentration - mass_concentration) / (1 - mass_concentration) - 1));
            unknown[key] = liquid_density;
            unknown, known = update_lists(unknown, known, key);
          } else if (liquid_throughput != 0 && liquid_flow != 0) {
            liquid_density = liquid_throughput * 1000 / liquid_flow;
            unknown[key] = liquid_density;
            unknown, known = update_lists(unknown, known, key);
          }
        }

        if (key == 'slurry_density') {
          if (liquid_density != 0 && mass_concentration != 0 && solids_density != 0) {
            slurry_density = liquid_density + (liquid_density * mass_concentration * (solids_density - liquid_density) / (solids_density - mass_concentration * (solids_density - liquid_density)));
            unknown[key] = slurry_density;
            unknown, known = update_lists(unknown, known, key);
          } else if (liquid_density != 0 && volume_concentration != 0 && solids_density != 0) {
            slurry_density = liquid_density + volume_concentration * (solids_density - liquid_density);
            unknown[key] = slurry_density;
            unknown, known = update_lists(unknown, known, key);
          } else if (slurry_throughput != 0 && slurry_flow != 0) {
            slurry_density = slurry_throughput * 1000 / slurry_flow
            unknown[key] = slurry_density;
            unknown, known = update_lists(unknown, known, key);
          }
        }

        if (key == 'volume_concentration') {
          if (slurry_density != 0 && liquid_density != 0 && solids_density != 0) {
            volume_concentration = (slurry_density - liquid_density) / (solids_density - liquid_density);
            unknown[key] = volume_concentration;
            unknown, known = update_lists(unknown, known, key);
          } else if (liquid_density != 0 && solids_density != 0 && mass_concentration != 0) {
            volume_concentration = liquid_density / ((solids_density / mass_concentration) - (solids_density - liquid_density));
            unknown[key] = volume_concentration;
            unknown, known = update_lists(unknown, known, key);
          } else if (solids_flow != 0 && slurry_flow != 0) {
            volume_concentration = solids_flow / slurry_flow;
            unknown[key] = volume_concentration;
            unknown, known = update_lists(unknown, known, key);
          }
        }

        if (key == 'mass_concentration') {
          if (solids_density != 0 && slurry_density != 0 && liquid_density != 0) {
            mass_concentration = (solids_density * (slurry_density - liquid_density)) / (slurry_density * (solids_density - liquid_density));
            unknown[key] = mass_concentration;
            unknown, known = update_lists(unknown, known, key);
          } else if (solids_density != 0 && liquid_density != 0 && volume_concentration != 0) {
            mass_concentration = solids_density / ((liquid_density / volume_concentration) + (solids_density - liquid_density));
            unknown[key] = mass_concentration;
            unknown, known = update_lists(unknown, known, key);
          } else if (solids_throughput != 0 && slurry_throughput != 0) {
            mass_concentration = solids_throughput / slurry_throughput;
            unknown[key] = mass_concentration;
            unknown, known = update_lists(unknown, known, key);
          } else if (solids_density != 0 && slurry_density != 0 && liquid_density != 0) {
            mass_concentration = (solids_density * (slurry_density - liquid_density)) / (liquid_density * (solids_density - liquid_density) + (slurry_density - liquid_density) * (solids_density - liquid_density));
            unknown[key] = mass_concentration;
            unknown, known = update_lists(unknown, known, key);
          }
        }

      }
    }
    count = count + 1;
  }

  // prevent input errors from being plotted
  if (mass_concentration > 1 || volume_concentration > 1) {
    solids_throughput = 0;
    liquid_throughput = 0;
    slurry_throughput = 0;
    solids_density = 0;
    liquid_density = 0;
    slurry_density = 0;
    solids_flow = 0;
    liquid_flow = 0;
    slurry_flow = 0;
    mass_concentration = 0 / 100;
    volume_concentration = 0 / 100;
  }

  // output image
  background('whitesmoke');
  let bar_width = 100;
  let start_height = 100;
  let total_bar_height = 500;
  let mass_start = 50;
  let volume_start = 500;
  text('Solids Density (kg/m3): ' + solids_density.toPrecision(4), 25, 30);
  text('Liquid Density (kg/m3): ' + liquid_density.toPrecision(4), 375, 30);
  text('Slurry Density (kg/m3): ' + slurry_density.toPrecision(4), 725, 30);
  stroke('black');
  text('Mass', mass_start, 75);
  text('Volume', volume_start, 75);

  // output liquid portion
  stroke('blue');
  fill('blue');
  liquid_mass_height = liquid_throughput / slurry_throughput * total_bar_height;
  liquid_volume_height = liquid_flow / slurry_flow * total_bar_height;
  rect(mass_start, start_height, bar_width, liquid_mass_height);
  rect(volume_start, start_height, bar_width, liquid_volume_height);

  // output solid portion
  stroke('brown');
  fill('brown');
  solids_mass_height = solids_throughput / slurry_throughput * total_bar_height;
  solids_volume_height = solids_flow / slurry_flow * total_bar_height;
  rect(mass_start, start_height + liquid_mass_height, bar_width, solids_mass_height);
  rect(volume_start, start_height + liquid_volume_height, bar_width, solids_volume_height);

  // output text
  fill('black');
  noStroke();
  textFont('Courier New');
  textSize(16);
  var x_location = mass_start + bar_width + 5;
  var y_location = start_height + 10;
  var y_spacing = 20;
  text('Mass Concentration  (%): ' + (mass_concentration * 100).toPrecision(3), x_location, y_location);
  y_location = y_location + y_spacing;
  y_location = y_location + y_spacing;
  text('Solids Throughput (t/h): ' + solids_throughput.toPrecision(3), x_location, y_location);
  y_location = y_location + y_spacing;
  text('Liquid Throughput (t/h): ' + liquid_throughput.toPrecision(3), x_location, y_location);
  y_location = y_location + y_spacing;
  text('Slurry Throughput (t/h): ' + slurry_throughput.toPrecision(3), x_location, y_location);
  var x_location = volume_start + bar_width + 5;
  var y_location = start_height + 10;
  text('Volume Concentration (%): ' + (volume_concentration * 100).toPrecision(3), x_location, y_location);
  y_location = y_location + y_spacing;
  y_location = y_location + y_spacing;
  text('Solids Flow       (m3/h): ' + solids_flow.toPrecision(3), x_location, y_location);
  y_location = y_location + y_spacing;
  text('Liquid Flow       (m3/h): ' + liquid_flow.toPrecision(3), x_location, y_location);
  y_location = y_location + y_spacing;
  text('Slurry Flow       (m3/h): ' + slurry_flow.toPrecision(3), x_location, y_location);
  text('lee.goudzwaard@patersoncooke.com', 5, height - 5);
}

function update_lists(uk_dict, k_dict, key) {
  k_dict[key] = uk_dict[key];
  delete uk_dict[key];
  return uk_dict, k_dict
}