from rdkit import Chem
from rdkit.Chem import MolFromSmiles, MolFromPDBFile, SDMolSupplier, MolToMolFile, RWMol, RemoveAllHs, BondType
import copy

def assign_bonds(input_file, smiles, output_sdf):
    refmol = MolFromSmiles(smiles)
    refmol2 = MolFromSmiles(smiles)
    
    # Load the input molecule (PDB or SDF)
    if input_file.endswith(".pdb"):
        mol2 = MolFromPDBFile(input_file, sanitize=False)
        if not mol2:
            raise ValueError(f"Failed to load PDB file: {input_file}")
    elif input_file.endswith(".sdf"):
        mol_supplier = SDMolSupplier(input_file, sanitize=False, strictParsing=False)
        mol2 = mol_supplier[0]
        if not mol2:
            raise ValueError(f"Failed to load SDF file: {input_file}")

    refmol = RemoveAllHs(refmol2, sanitize=False)
    refmol2 = RemoveAllHs(refmol2, sanitize=False)
    mol2 = RemoveAllHs(mol2, sanitize=False)

    # do the molecules match already?
    matching = mol2.GetSubstructMatch(refmol2)
    if not matching:  # no, they don't match
        # check if bonds of mol are SINGLE
        for b in mol2.GetBonds():
            if b.GetBondType() != BondType.SINGLE:
                b.SetBondType(BondType.SINGLE)
                b.SetIsAromatic(False)

        # set the bonds of refmol2 to SINGLE
        for b in refmol2.GetBonds():
            b.SetBondType(BondType.SINGLE)
            b.SetIsAromatic(False)

        # set atom charges to zero;
        for a in refmol2.GetAtoms():
            a.SetFormalCharge(0)
        for a in mol2.GetAtoms():
            a.SetFormalCharge(0)

        matching = mol2.GetSubstructMatches(refmol2, uniquify=False)
        # do the molecules match now?
        if matching:
            matching = matching[0]
            # apply matching: set bond properties
            for b in refmol.GetBonds():
                atom1 = matching[b.GetBeginAtomIdx()]
                atom2 = matching[b.GetEndAtomIdx()]
                b2 = mol2.GetBondBetweenAtoms(atom1, atom2)
                b2.SetBondType(b.GetBondType())
                b2.SetIsAromatic(b.GetIsAromatic())
            # apply matching: set atom properties
            for a in refmol.GetAtoms():
                a2 = mol2.GetAtomWithIdx(matching[a.GetIdx()])
                a2.SetHybridization(a.GetHybridization())
                a2.SetIsAromatic(a.GetIsAromatic())
                a2.SetNumExplicitHs(a.GetNumExplicitHs())
                a2.SetFormalCharge(a.GetFormalCharge())
            if hasattr(mol2, '__sssAtoms'):
                mol2.__sssAtoms = None  # we don't want all bonds highlighted
        else:
            try:
                assign_bonds2(input_file, smiles, output_sdf)
                return
            except:
                raise ValueError("2. No matching found")

    if len(refmol.GetBonds()) != len(mol2.GetBonds()):
        matching = mol2.GetSubstructMatches(refmol, uniquify=True)
        # do the molecules match now?
        if matching:
            matching = matching[0]
            # apply matching: set bond properties
            editable_mol = RWMol(mol2)

            for b in mol2.GetBonds():
                atom1 = matching[b.GetBeginAtomIdx()]
                atom2 = matching[b.GetEndAtomIdx()]
                b2 = refmol.GetBondBetweenAtoms(atom1, atom2)
                if not b2:
                    # BUG
                    editable_mol.RemoveBond(b.GetBeginAtomIdx(), b.GetEndAtomIdx())

            mol2 = editable_mol.GetMol()

    mol2 = RemoveAllHs(mol2, sanitize=True) # Just to sanitize the molecule
    if matching:
        mol2 = RenumberAtoms(mol2, list(matching))
    MolToMolFile(mol2, output_sdf, forceV3000=False) 


    
#This function is moved below assign_bonds for better readability. It does the same except that it replaces halogens with carbons to increase the chances of matching.
def assign_bonds2(input_file, smiles, output_sdf):
    refmol = MolFromSmiles(smiles)

    # Load the input molecule (PDB or SDF)
    if input_file.endswith(".pdb"):
        mol2 = MolFromPDBFile(input_file, sanitize=False)
        if not mol2:
            raise ValueError(f"Failed to load PDB file: {input_file}")
    elif input_file.endswith(".sdf"):
        mol_supplier = SDMolSupplier(input_file, sanitize=False, strictParsing=False)
        mol2 = mol_supplier[0]
        if not mol2:
            raise ValueError(f"Failed to load SDF file: {input_file}")

    refmol = RemoveAllHs(refmol, sanitize=False)
    mol2 = RemoveAllHs(mol2, sanitize=False)
    orig = copy.deepcopy(refmol)

    matching = mol2.GetSubstructMatch(refmol)

    if not matching:
        # set the bonds of mol2 to SINGLE
        for b in mol2.GetBonds():
            if b.GetBondType() != BondType.SINGLE:
                b.SetBondType(BondType.SINGLE)
                b.SetIsAromatic(False)

        # set the bonds of refmol2 to SINGLE
        for b in refmol.GetBonds():
            b.SetBondType(BondType.SINGLE)
            b.SetIsAromatic(False)

        # set atom charges to zero;
        for a in refmol.GetAtoms():
            a.SetFormalCharge(0)
        for a in mol2.GetAtoms():
            a.SetFormalCharge(0)

        refmol_modified = replace_halogens_with_carbons(refmol)
        mol2_modified = mol2

        matching = mol2_modified.GetSubstructMatches(refmol_modified, uniquify=False)
        if matching:
            matching = matching[0]
            refmol = orig

            # Apply matching: set bond properties
            for b in refmol.GetBonds():
                atom1 = matching[b.GetBeginAtomIdx()]
                atom2 = matching[b.GetEndAtomIdx()]
                b2 = mol2.GetBondBetweenAtoms(atom1, atom2)
                b2.SetBondType(b.GetBondType())
                b2.SetIsAromatic(b.GetIsAromatic())

            # Apply matching: set atom properties
            for a in refmol.GetAtoms():
                a2 = mol2.GetAtomWithIdx(matching[a.GetIdx()])
                a2.SetHybridization(a.GetHybridization())
                a2.SetIsAromatic(a.GetIsAromatic())
                a2.SetNumExplicitHs(a.GetNumExplicitHs())
                a2.SetFormalCharge(a.GetFormalCharge())
                a2.SetAtomicNum(a.GetAtomicNum())  # Restore halogen

            if hasattr(mol2, '__sssAtoms'):
                mol2.__sssAtoms = None  # Avoid highlighting all bonds
        else:
            raise ValueError("No matching found even after halogen replacement")

    mol2 = RemoveAllHs(mol2, sanitize=True)  # Sanitize the molecule
    if matching:
        mol2 = RenumberAtoms(mol2, list(matching))
    MolToMolFile(mol2, output_sdf, forceV3000=False)