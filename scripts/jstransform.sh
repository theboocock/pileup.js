#!/bin/bash

export JSTRANSFORM_OPTS="--react --harmony --strip-types --non-strict-es6module"
jstransform $JSTRANSFORM_OPTS lib/ src/
jstransform $JSTRANSFORM_OPTS lib-test/ test/
