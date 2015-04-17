/* @flow */
'use strict';

var chai = require('chai');
var expect = chai.expect;

var Bam = require('../src/bam'),
    createBamDataSource = require('../src/BamDataSource'),
    ContigInterval = require('../src/ContigInterval'),
    MappedRemoteFile = require('./MappedRemoteFile');

describe('BamDataSource', function() {
  function getTestSource() {
    // See test/data/README.md for provenance of these files.
    var remoteBAI = new MappedRemoteFile('/test/data/dream.synth3.bam.bai.mapped',
                                         [[8054040, 8242920]]),
        remoteBAM = new MappedRemoteFile('/test/data/dream.synth3.bam.mapped',
                                         [[0, 69453], [163622109888, 163622739903]]);

    var bam = new Bam(remoteBAM, remoteBAI, {
      // "chunks" is usually an array; here we take advantage of the
      // Object-like nature of JavaScript arrays to create a sparse array.
      "chunks": { "19": [8054040, 8242920] },
      "minBlockIndex": 69454
    });

    return createBamDataSource(bam);
  }

  it('should extract features in a range', function(done) {
    this.timeout(5000);
    var source = getTestSource();

    // This range matches the "large, dense" test in bam-test.js
    var range = new ContigInterval('20', 31511349, 31514172);
    var reads = source.getAlignmentsInRange(range);
    expect(reads).to.deep.equal([]);

    // Fetching that one gene should cache its entire block.
    source.on('newdata', () => {
      var reads = source.getAlignmentsInRange(range);
      expect(reads).to.have.length(1114);
      expect(reads[0].toString()).to.equal('20:31511251-31511351');
      expect(reads[1113].toString()).to.equal('20:31514171-31514271');
      done();
    });
    source.rangeChanged({
      contig: range.contig,
      start: range.start(),
      stop: range.stop()
    });
  });
});